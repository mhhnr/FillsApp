
1. **First, let's find the API Gateway**:
- Go to AWS Console
- Search for "API Gateway" in the search bar
- Click on "API Gateway" service

1. **Create a new API**:
2. Click "Create API"
3. Select "REST API" (not private)
4. Click "Build"
5. Fill in basic info:
   - API name: "Medical Forms API"
   - Description: "API for medical forms management"
   - Keep other settings default
6. Click "Create API"

7. **Set up the Authorizer**:
8. In the left sidebar, click "Authorizers"
9. Click "Create New Authorizer"
10. Configure:
   ```
   Name: FirebaseAuthorizer
   Type: Lambda
   Lambda Function: verify_firebase_token
   Lambda Invoke Role: (leave empty)
   Identity Sources: Header
   Header Name: Authorization
   TTL: 300
   ```
11. Click "Create"

12. **Create Resources and Methods**:
13. Click "Resources" in left sidebar
14. Click "Actions" → "Create Resource"
15. Create these resources:

```plaintext
/
├── /templates
│   └── /{templateId}
└── /forms
    └── /{formId}
```

For each endpoint:
1. Select the resource (e.g., `/templates`)
2. Click "Actions" → "Create Method"
3. Set up each method:

For `/templates`:
```
GET
- Integration type: Lambda Function
- Lambda Function: forms-crud-handler
- Use Lambda Proxy integration: Yes
- Authorization: FirebaseAuthorizer

POST
- Same settings as GET
```

For `/templates/{templateId}`:
```
GET, PUT, DELETE
- Same settings as above
```

For `/forms`:
```
GET, POST
- Same settings as above
```

For `/forms/{formId}`:
```
GET, PUT, DELETE
- Same settings as above
```

5. **Deploy the API**:
1. Click "Actions" → "Deploy API"
2. Create new stage:
   - Stage name: "prod"
   - Description: "Production stage"
3. Click "Deploy"

6. **Get your API URL**:
- After deployment, you'll see "Invoke URL"
- It looks like: `https://xxxxx.execute-api.region.amazonaws.com/prod`
- Save this URL

7. **Test with Postman**:
1. Create a new collection in Postman
2. Set up environment variables:
```
API_URL: Your API Invoke URL
TOKEN: (you'll get this from Firebase)
```

Here's a Postman collection you can import:

```json
{
  "info": {
    "name": "Medical Forms API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Templates",
      "item": [
        {
          "name": "List Templates",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{TOKEN}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{API_URL}}/templates",
              "host": ["{{API_URL}}"],
              "path": ["templates"]
            }
          }
        },
        {
          "name": "Create Template",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{TOKEN}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Medical History Form\",\n  \"fields\": [\n    {\n      \"id\": \"1\",\n      \"type\": \"text\",\n      \"label\": \"Patient Name\",\n      \"required\": true\n    }\n  ]\n}"
            },
            "url": {
              "raw": "{{API_URL}}/templates",
              "host": ["{{API_URL}}"],
              "path": ["templates"]
            }
          }
        }
      ]
    },
    {
      "name": "Forms",
      "item": [
        {
          "name": "Create Form",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{TOKEN}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"templateId\": \"your-template-id\",\n  \"data\": {\n    \"1\": \"John Doe\"\n  }\n}"
            },
            "url": {
              "raw": "{{API_URL}}/forms",
              "host": ["{{API_URL}}"],
              "path": ["forms"]
            }
          }
        }
      ]
    }
  ]
}

```

To get a Firebase token for testing:
1. In your React Native app, after login:
```javascript
const token = await auth.currentUser.getIdToken();
console.log('Token:', token);
```
2. Copy this token to Postman's TOKEN environment variable

Would you like me to:
1. Show you how to set up CORS?
2. Explain how to add the API URL to your frontend app?
3. Show you how to monitor API calls?
4. Add more test cases to the Postman collection?