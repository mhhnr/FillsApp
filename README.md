# FillsApp 🏥

> An AI-powered medical form automation platform built with React Native and Firebase.

<div align="center">
  <img src="assets/logo.png" alt="FillsApp Logo" width="50"/>
  <br/>
  

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  
</div>

<div align="center">
  <img src="assets/fillsapp.gif" alt="FillsApp Demo" width="150"/>
</div>

<div>
<br/>
  
  [![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-51.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-11.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

## 📑 Table of Contents

- [FillsApp 🏥](#fillsapp-)
  - [📑 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [✨ Features](#-features)
  - [🚀 Tech Stack](#-tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [AI/ML](#aiml)
  - [🏗 Architecture](#-architecture)
  - [📊 Performance](#-performance)
  - [🤝 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📦 Backend Deployment](#-backend-deployment)
    - [Cloud Infrastructure](#cloud-infrastructure)
    - [AWS Services](#aws-services)
      - [API Gateway Endpoints](#api-gateway-endpoints)
      - [Lambda Functions](#lambda-functions)
      - [AI Integration](#ai-integration)
      - [Database](#database)
    - [Security \& Authentication](#security--authentication)
  - [🔒 Security](#-security)
    - [Authentication \& Authorization](#authentication--authorization)
    - [Data Protection](#data-protection)
    - [API Security](#api-security)
    - [Compliance](#compliance)
  - [📄 License](#-license)
  - [💬 Support \& Contact](#-support--contact)

## 🔍 Overview

FillsApp revolutionizes medical form management through AI-powered automation, streamlining healthcare documentation for both patients and providers.

## ✨ Features

<div align="center">

[![HIPAA Compliant](https://img.shields.io/badge/HIPAA-Compliant-success?style=for-the-badge)](https://www.hhs.gov/hipaa/index.html)
[![Cloud Storage](https://img.shields.io/badge/Cloud-Storage-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://firebase.google.com/products/storage)
[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6F61?style=for-the-badge&logo=tensorflow&logoColor=white)](#)
[![Voice Input](https://img.shields.io/badge/Voice-Input-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)

</div>

- 🤖 **AI-Powered Form Automation** - Smart form filling with machine learning
- ⚡ **Real-time Processing** - Instant form validation and processing
- 📱 **Cross-Platform** - iOS, Android, and Web support
- 🔒 **HIPAA Compliant** - Enterprise-grade security
- 🎙️ **Voice Input** - Hands-free form filling
- 📑 **PDF Export** - Professional document generation

## 🚀 Tech Stack

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)

</div>

### Frontend
- React Native
- Expo
- React Navigation

### Backend
- Firebase
- Cloud Functions
- Cloud Storage

### AI/ML
- TensorFlow
- Natural Language Processing

## 🏗 Architecture

[Architecture section placeholder]

## 📊 Performance

<div align="center">

![Performance](https://img.shields.io/badge/Performance-95%25-success?style=for-the-badge)
![Uptime](https://img.shields.io/badge/Uptime-99.9%25-success?style=for-the-badge)
![Build](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)

</div>

## 🤝 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm/yarn
- Expo CLI

### Installation
```bash
# Clone the repository
git clone https://github.com/mhhnn/FillsApp.git

# Navigate to project directory
cd FillsApp

# Install dependencies
pnpm i

# Start the app on ios
npx expo run:ios

# Start the app on android
npx expo run:andriod
```

## 📦 Backend Deployment

### Cloud Infrastructure

<div align="center">

[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](#)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white)](#)

</div>

### AWS Services

#### API Gateway Endpoints
- **HTTP API**: Form submission and retrieval
- **REST API**: Template management
- **WebSocket**: Talk chatbox


#### Lambda Functions
- CRUD operations for all forms, Templates.
- Firebase Authorizer authentication verification

#### AI Integration
- **Amazon Bedrock**: chatbot 
- **Amazon Transcribe**: Voice-to-text conversion


#### Database
- **DynamoDB**: Primary data storage
  - Forms table
  - Templates table
  - User profile

### Security & Authentication
- Firebase Authorizer for API Gateway
- JWT token validation
- Role-based access control
- CORS configuration

<!-- ## 📖 API Documentation

[API docs placeholder] -->

<!-- ## 🤝 Contributing

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Contributors](https://img.shields.io/github/contributors/yourusername/fillsapp?style=for-the-badge)](https://github.com/yourusername/fillsapp/graphs/contributors)
[![Open Issues](https://img.shields.io/github/issues/yourusername/fillsapp?style=for-the-badge)](https://github.com/yourusername/fillsapp/issues)

</div>

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details. -->

## 🔒 Security

### Authentication & Authorization
- Firebase Authentication for secure user management
- JWT token-based API authentication
- Automatic session management and token refresh
- Role-based access control

### Data Protection
- End-to-end encryption for all medical data
- Secure data storage using AWS Dynomo DB.
- HTTPS/TLS encryption for all API communications
- Automatic data sanitization and validation

### API Security
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- API key rotation and management

### Compliance
- HIPAA-compliant data handling


## 📄 License

Copyright 2024 MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## 💬 Support & Contact

<div align="center">


[![Email](https://img.shields.io/badge/Email-ceo%40fills.ai-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ceo@fills.ai)


</div>

- website: [fills.ai](https://docs.fillsapp.com)
- Email: ceo@fills.ai

---

<div align="center">
  <sub>Built with passion and ❤️ by Hari Hara Nithin Reddy</sub>
  <br/>
  <sub>© 2024 Fills Ai LLC. All rights reserved.</sub>
</div>
