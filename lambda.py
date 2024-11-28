import json
import boto3
import time
import uuid
from typing import Dict, Any, List, Optional, Union
import logging
from decimal import Decimal, DecimalException
from openai import OpenAI
import os
from pydantic import BaseModel, Field, RootModel
import traceback

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('API_KEY'))

# Set up logging 
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
form_templates_table = dynamodb.Table('FormTemplates')
filled_forms_table = dynamodb.Table('FilledForms')

class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that handles Decimal types"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)

def safe_json_dumps(obj: Any) -> str:
    """Safely convert an object to JSON string, handling Decimal types"""
    return json.dumps(obj, cls=DecimalEncoder)

def convert_floats_to_decimals(obj: Any) -> Any:
    """Recursively convert float values to Decimal for DynamoDB compatibility"""
    try:
        if isinstance(obj, float):
            return Decimal(str(obj))
        elif isinstance(obj, dict):
            return {k: convert_floats_to_decimals(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_floats_to_decimals(x) for x in obj]
        return obj
    except (ValueError, DecimalException) as e:
        logger.warning(f"Error converting to Decimal: {str(e)}")
        return str(obj)

# Pydantic models for structured output
class FormFieldValue(RootModel):
    """Model for form field values"""
    root: Dict[str, Any]

class FormFieldExtraction(BaseModel):
    """Model for field extraction results with optional value"""
    value: Optional[Any] = None
    source_quote: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)

class FormResponse(BaseModel):
    """Model for the complete form response"""
    fields: Dict[str, FormFieldExtraction]

def convert_value_for_field_type(value: Any, field_type: str) -> Any:
    """Convert extracted value to appropriate type based on field type"""
    try:
        if field_type == 'number':
            if isinstance(value, (float, int)):
                return Decimal(str(value))
            return str(value)
        elif field_type in ['select', 'text', 'textarea', 'rich_text', 'tel', 'email']:
            return str(value) if not isinstance(value, list) else ', '.join(map(str, value))
        elif field_type in ['multiple_select', 'checkbox_group']:
            return value if isinstance(value, list) else [str(value)]
        elif field_type == 'table':
            table_data = value if isinstance(value, list) else [value]
            return convert_floats_to_decimals(table_data)
        return value
    except Exception as e:
        logger.error(f"Error converting value {value} for type {field_type}: {str(e)}")
        return str(value)

def get_example_value(field_type: str, options: Optional[List[str]] = None) -> str:
    """Generate example values based on field type"""
    if field_type == 'text':
        return "text value"
    elif field_type == 'date':
        return "YYYY-MM-DD"
    elif field_type == 'number':
        return "numeric value"
    elif field_type == 'select' and options:
        return f"one of: {', '.join(options)}"
    elif field_type == 'multiple_select' and options:
        return f"array of: {', '.join(options)}"
    elif field_type == 'checkbox_group' and options:
        return f"array of selected: {', '.join(options)}"
    elif field_type == 'textarea' or field_type == 'rich_text':
        return "detailed text"
    return "value"

def process_fields(fields: List[Dict[str, Any]], prefix: str = "") -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Process fields recursively and collect both field types and example formats"""
    field_info = []
    field_types = {}
    
    for field in fields:
        current_id = f"{prefix}{field['id']}" if prefix else field['id']
        
        if field['type'] in ['section', 'group'] and 'fields' in field:
            nested_info, nested_types = process_fields(field['fields'], f"{current_id}.")
            field_info.extend(nested_info)
            field_types.update(nested_types)
        elif field['type'] == 'table' and 'columns' in field:
            field_types[current_id] = {
                'type': 'table',
                'columns': field['columns']
            }
            field_info.append({
                'id': current_id,
                'type': 'table',
                'label': field['label'],
                'columns': field['columns'],
                'example': [
                    {col['id']: f"value for {col['label']}" for col in field['columns']}
                ]
            })
        else:
            field_types[current_id] = field['type']
            example_value = get_example_value(field['type'], field.get('options', None))
            field_info.append({
                'id': current_id,
                'type': field['type'],
                'label': field['label'],
                'options': field.get('options', None),
                'example': example_value
            })
    
    return field_info, field_types

def extract_form_data(template_fields: Dict[str, Any], conversation_text: str) -> Dict[str, Any]:
    """Extract form data based on template fields structure"""
    try:
        logger.info("Starting form data extraction")
        
        # Convert template fields to the format expected by OpenAI
        field_info = []
        for section_name, section_fields in template_fields.items():
            for field_id, field_config in section_fields.items():
                field_info.append({
                    'id': f"{section_name}.{field_id}",
                    'type': field_config['type'],
                    'label': field_config['label'],
                    'required': field_config.get('required', False)
                })

        field_descriptions = """Extract information from the conversation following these rules:
1. Only include fields where information is explicitly mentioned
2. Skip fields where no relevant information is found
3. For each found field, provide:
   - value: The extracted information (numbers should be without units)
   - source_quote: The exact text from conversation
   - confidence: A number between 0.0 and 1.0

Fields to extract:\n"""
        field_descriptions += "\n".join([
            f"- {field['label']} (ID: {field['id']}, Type: {field['type']})"
            for field in field_info
        ])

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a precise medical form data extraction assistant.
Extract only explicitly mentioned information.
Skip any fields where information is not found.
Return numeric values without units (e.g., '75' instead of '75 kg').
Only include confidence scores where you are highly confident (>0.8)."""
                },
                {
                    "role": "user",
                    "content": f"""Extract available information from this conversation:

{field_descriptions}

Conversation:
{conversation_text}

Format the response as JSON:
{{
    "fields": {{
        "section.field_id": {{
            "value": (extracted value),
            "source_quote": "exact quote",
            "confidence": 0.95
        }}
    }}
}}"""
                }
            ],
            response_format={"type": "json_object"}
        )
        
        response_content = completion.choices[0].message.content
        logger.debug(f"Raw OpenAI response: {response_content}")
        
        parsed_response = FormResponse.model_validate_json(response_content)
        
        # Convert the flat response back to nested structure
        nested_data = {}
        for field_id, field_data in parsed_response.fields.items():
            if field_data.value is not None and field_data.confidence and field_data.confidence > 0.8:
                section, field = field_id.split('.')
                if section not in nested_data:
                    nested_data[section] = {}
                nested_data[section][field] = field_data.value
        
        logger.info(f"Successfully extracted {len(nested_data)} sections")
        logger.debug(f"Extracted data: {safe_json_dumps(nested_data)}")
        return nested_data

    except Exception as e:
        logger.error(f"Error in form extraction: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def create_template(user_id: str, template_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new form template."""
    template_id = str(uuid.uuid4())
    timestamp = int(time.time())
    
    item = {
        'templateId': template_id,
        'userId': user_id,
        'name': template_data.get('name', 'Untitled Form'),
        'fields': template_data.get('fields', []),
        'createdAt': timestamp,
        'updatedAt': timestamp
    }
    
    form_templates_table.put_item(Item=item)
    return item

def get_template(template_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Get a form template."""
    response = form_templates_table.get_item(
        Key={
            'templateId': template_id,
            'userId': user_id
        }
    )
    return response.get('Item')

def list_templates(user_id: str) -> list:
    """List all templates for a user."""
    response = form_templates_table.query(
        IndexName='userIdIndex',
        KeyConditionExpression='userId = :uid',
        ExpressionAttributeValues={
            ':uid': user_id
        }
    )
    return response.get('Items', [])

def update_template(template_id: str, user_id: str, template_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update a form template."""
    timestamp = int(time.time())
    
    update_expression = 'SET updatedAt = :timestamp'
    expression_values = {':timestamp': timestamp}
    expression_names = {}
    
    if 'name' in template_data:
        update_expression += ', #name = :name'
        expression_values[':name'] = template_data['name']
        expression_names['#name'] = 'name'
    
    if 'fields' in template_data:
        update_expression += ', #fields = :fields'
        expression_values[':fields'] = template_data['fields']
        expression_names['#fields'] = 'fields'
    
    response = form_templates_table.update_item(
        Key={
            'templateId': template_id,
            'userId': user_id
        },
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values,
        ExpressionAttributeNames=expression_names,
        ReturnValues='ALL_NEW'
    )
    return response.get('Attributes')

def delete_template(template_id: str, user_id: str) -> Dict[str, Any]:
    """Delete a form template."""
    response = form_templates_table.delete_item(
        Key={
            'templateId': template_id,
            'userId': user_id
        },
        ReturnValues='ALL_OLD'
    )
    return response.get('Attributes')

def create_filled_form(user_id: str, form_data: Dict[str, Any], conversation_text: Optional[str] = None) -> Dict[str, Any]:
    """Create a filled form with proper type handling."""
    form_id = str(uuid.uuid4())
    timestamp = int(time.time())
    
    try:
        if conversation_text and form_data.get('templateFields'):
            # Extract data using template fields
            extracted_data = extract_form_data(form_data['templateFields'], conversation_text)
            converted_data = convert_floats_to_decimals(extracted_data)
            
            # Merge with existing data
            form_data['data'] = {
                **converted_data,
                **convert_floats_to_decimals(form_data.get('data', {}))
            }
        
        # Ensure required fields are present
        if 'templateCode' not in form_data:
            raise ValueError("templateCode is required")
        if 'data' not in form_data:
            raise ValueError("data is required")
            
        item = {
            'formId': form_id,
            'userId': user_id,
            'templateCode': form_data['templateCode'],  # Make sure this is required
            'data': convert_floats_to_decimals(form_data['data']),
            'createdAt': timestamp,
            'updatedAt': timestamp
        }
        
        logger.info(f"Creating form with data: {safe_json_dumps(item)}")
        filled_forms_table.put_item(Item=item)
        return item
        
    except Exception as e:
        logger.error(f"Error creating filled form: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def get_filled_form(form_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Get a filled form."""
    response = filled_forms_table.get_item(
        Key={
            'formId': form_id,
            'userId': user_id
        }
    )
    return response.get('Item')

def list_filled_forms(user_id: str, template_code: Optional[str] = None) -> list:
    """List all filled forms for a user, optionally filtered by template."""
    try:
        if template_code:
            # Use the GSI with templateId instead of templateCode
            response = filled_forms_table.query(
                IndexName='userIdIndex',
                KeyConditionExpression='userId = :uid AND templateId = :tid',
                ExpressionAttributeValues={
                    ':uid': user_id,
                    ':tid': template_code  # We're using templateCode as templateId
                }
            )
        else:
            # When no template_code is provided, just query by userId
            response = filled_forms_table.query(
                IndexName='userIdIndex',
                KeyConditionExpression='userId = :uid',
                ExpressionAttributeValues={
                    ':uid': user_id
                }
            )
        
        items = response.get('Items', [])
        logger.info(f"Query returned {len(items)} items")
        
        if not items:
            # Fallback to scan if query returns no results
            logger.info("Query returned no results, attempting scan fallback")
            scan_response = filled_forms_table.scan()
            all_items = scan_response.get('Items', [])
            
            # Filter items for the specific user
            items = [item for item in all_items if item.get('userId') == user_id]
            if template_code:
                items = [item for item in items if item.get('templateCode') == template_code]
            
            logger.info(f"Fallback scan found {len(items)} items")
        
        return items
        
    except Exception as e:
        logger.error(f"Error listing filled forms: {str(e)}")
        logger.error(traceback.format_exc())
        raise
        
def update_filled_form(form_id: str, user_id: str, form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update a filled form with proper type handling."""
    timestamp = int(time.time())
    
    # Convert any float values to Decimal
    converted_data = convert_floats_to_decimals(form_data.get('data', {}))
    
    update_expression = 'SET updatedAt = :timestamp, #data = :data'
    expression_values = {
        ':timestamp': timestamp,
        ':data': converted_data
    }
    
    response = filled_forms_table.update_item(
        Key={
            'formId': form_id,
            'userId': user_id
        },
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values,
        ExpressionAttributeNames={'#data': 'data'},
        ReturnValues='ALL_NEW'
    )
    return response.get('Attributes')

def delete_filled_form(form_id: str, user_id: str) -> Dict[str, Any]:
    """Delete a filled form."""
    response = filled_forms_table.delete_item(
        Key={
            'formId': form_id,
            'userId': user_id
        },
        ReturnValues='ALL_OLD'
    )
    return response.get('Attributes')


def lambda_handler(event, context):
    try:
        # Print the entire event for debugging
        logger.info(f"Incoming event: {json.dumps(event)}")
        
        # Define CORS headers
        cors_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        }
        
        # Extract HTTP method more reliably
        http_method = event.get('requestContext', {}).get('http', {}).get('method', '')
        if not http_method:
            route_key = event.get('routeKey', '')
            http_method = route_key.split(' ')[0] if ' ' in route_key else ''
            
        logger.info(f"HTTP Method: {http_method}")
        
        # Get path
        path = event.get('rawPath', '')
        logger.info(f"Path: {path}")
        
        # Extract authorization context
        auth_context = event.get('requestContext', {}).get('authorizer', {}).get('lambda', {})
        logger.info(f"Auth context: {json.dumps(auth_context)}")
        
        if not auth_context:
            logger.error("No authorization context found")
            return {
                'statusCode': 401,
                'headers': cors_headers,
                'body': json.dumps({
                    'message': 'No authorization context found'
                })
            }
        
        user_id = auth_context.get('userId')
        if not user_id:
            logger.error("No userId found in auth context")
            return {
                'statusCode': 401,
                'headers': cors_headers,
                'body': json.dumps({'message': 'Unauthorized: Missing userId'})
            }
        
        # OPTIONS preflight response
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': ''
            }
        
        # Parse body with better error handling
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
                logger.info(f"Parsed request body: {json.dumps(body)}")
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing request body: {str(e)}")
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'message': 'Invalid JSON in request body',
                        'error': str(e)
                    })
                }
        
        # Route handler with detailed logging
        result = None
        try:
            # Templates endpoints
            if path == '/templates':
                if http_method == 'GET':
                    logger.info("Processing GET /templates request")
                    result = list_templates(user_id)
                elif http_method == 'POST':
                    logger.info("Processing POST /templates request")
                    if not body:
                        return {
                            'statusCode': 400,
                            'headers': cors_headers,
                            'body': json.dumps({'message': 'Request body is required'})
                        }
                    result = create_template(user_id, body)
            
            elif path.startswith('/templates/'):
                template_id = path.split('/')[-1]
                logger.info(f"Template ID from path: {template_id}")
                
                if http_method == 'GET':
                    logger.info(f"Processing GET /templates/{template_id} request")
                    result = get_template(template_id, user_id)
                elif http_method == 'PUT':
                    logger.info(f"Processing PUT /templates/{template_id} request")
                    if not body:
                        return {
                            'statusCode': 400,
                            'headers': cors_headers,
                            'body': json.dumps({'message': 'Request body is required'})
                        }
                    result = update_template(template_id, user_id, body)
                elif http_method == 'DELETE':
                    logger.info(f"Processing DELETE /templates/{template_id} request")
                    result = delete_template(template_id, user_id)
            
            # Forms endpoints
            elif path == '/forms':
                if http_method == 'GET':
                    logger.info("Processing GET /forms request")
                    template_code = event.get('queryStringParameters', {}).get('templateCode')  # Changed from templateId
                    logger.info(f"Fetching forms for user {user_id} with template code: {template_code}")
                    result = list_filled_forms(user_id, template_code)
                    logger.info(f"Found {len(result)} forms")
                elif http_method == 'POST':
                    logger.info("Processing POST /forms request")
                    if not body:
                        return {
                            'statusCode': 400,
                            'headers': cors_headers,
                            'body': json.dumps({'message': 'Request body is required'})
                        }
                    logger.info(f"Creating form with body: {json.dumps(body)}")
                    conversation_text = body.pop('conversationText', None)
                    result = create_filled_form(user_id, body, conversation_text)
            
            elif path.startswith('/forms/'):
                form_id = path.split('/')[-1]
                logger.info(f"Form ID from path: {form_id}")
                
                if http_method == 'GET':
                    logger.info(f"Processing GET /forms/{form_id} request")
                    result = get_filled_form(form_id, user_id)
                elif http_method == 'PUT':
                    logger.info(f"Processing PUT /forms/{form_id} request")
                    if not body:
                        return {
                            'statusCode': 400,
                            'headers': cors_headers,
                            'body': json.dumps({'message': 'Request body is required'})
                        }
                    result = update_filled_form(form_id, user_id, body)
                elif http_method == 'DELETE':
                    logger.info(f"Processing DELETE /forms/{form_id} request")
                    result = delete_filled_form(form_id, user_id)
        
        except Exception as e:
            logger.error(f"Error processing route: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({
                    'message': 'Error processing request',
                    'error': str(e)
                })
            }
        
        if result is None:
            logger.warning(f"No handler found for path: {path} and method: {http_method}")
            return {
                'statusCode': 404,
                'headers': cors_headers,
                'body': json.dumps({
                    'message': 'Route not found',
                    'path': path,
                    'method': http_method
                })
            }
        
        logger.info(f"Successful response: {safe_json_dumps(result)}")
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': safe_json_dumps(result)
        }
    
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({
                'message': 'Internal server error',
                'error': str(e)
            })
        }