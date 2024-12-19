# API Gateway Setup Guide

This guide will help you set up an API Gateway for the Medical Forms API.

## Prerequisites
- AWS Account with appropriate permissions
- AWS Console access
- Basic understanding of REST APIs

## Step 1: Initial Setup
1. Navigate to AWS Console
2. Search for "API Gateway" in the search bar
3. Click on "API Gateway" service

## Step 2: Create New API
1. Click "Create API" button
2. Select "REST API" (not private)
3. Click "Build"
4. Configure basic settings:
   - API name: "Medical Forms API"
   - Description: "API for medical forms management"
   - Keep other settings as default
5. Click "Create API"

## Step 3: Configure Authorizer
1. In the left sidebar, click "Authorizers"
2. Click "Create New Authorizer"
3. Use these settings:
   ```
   Name: FirebaseAuthorizer
   Type: Lambda
   Lambda Function: verify_firebase_token
   Lambda Invoke Role: (leave empty)
   Identity Sources: Header
   Header Name: Authorization
   TTL: 300
   ```
4. Click "Create"

## Step 4: Set Up API Structure
1. Click "Resources" in left sidebar
2. Click "Actions" → "Create Resource"
3. Create the following structure:
   ```plaintext
   /
   ├── /templates
   │   └── /{templateId}
   └── /forms
       └── /{formId}
   ```

## Step 5: Configure Endpoints
For each endpoint below, follow these steps:
1. Select the resource
2. Click "Actions" → "Create Method"
3. Configure the settings as specified

### Templates Endpoint (`/templates`)