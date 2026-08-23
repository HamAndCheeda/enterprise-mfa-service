# Enterprise MFA Service API Documentation

## Overview

The Enterprise MFA Service provides a comprehensive REST API for implementing multi-factor authentication in enterprise applications.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All requests (except `/auth/register` and `/auth/login`) require a Bearer token:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!@"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "abc123",
    "email": "user@example.com"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!@"
}
```

**Response (MFA not enabled):**
```json
{
  "message": "Login successful",
  "tokens": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

**Response (MFA required):**
```json
{
  "message": "MFA required",
  "requires_mfa": true,
  "user_id": "abc123"
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

### MFA Setup

#### Setup TOTP

```http
POST /mfa/setup/totp
Content-Type: application/json

{
  "user_id": "abc123",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "TOTP setup initiated",
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qr_code": "data:image/png;base64,..."
}
```

#### Setup SMS

```http
POST /mfa/setup/sms
Content-Type: application/json

{
  "user_id": "abc123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "SMS challenge sent",
  "challenge_id": "chal123",
  "expires_in": 300
}
```

#### Generate Backup Codes

```http
POST /mfa/backup-codes
Content-Type: application/json

{
  "user_id": "abc123"
}
```

**Response:**
```json
{
  "message": "Backup codes generated",
  "codes": [
    "a1b2c3d4",
    "e5f6g7h8",
    "..."
  ],
  "note": "Store these codes in a safe place. Each code can only be used once."
}
```

### MFA Verification

#### Verify MFA

```http
POST /mfa/verify
Content-Type: application/json

{
  "challenge_id": "chal123",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "MFA verification successful",
  "verified": true
}
```

### Audit Logs

#### Get All Audit Logs

```http
GET /audit/logs
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Audit logs retrieved",
  "logs": []
}
```

#### Get User Audit Logs

```http
GET /audit/logs/:userId
Authorization: Bearer <access_token>
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "status": 400
}
```

### Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes
- MFA attempts: 5 attempts per 5 minutes

## Password Requirements

Passwords must:
- Be at least 12 characters long
- Contain at least one uppercase letter (A-Z)
- Contain at least one lowercase letter (a-z)
- Contain at least one number (0-9)
- Contain at least one special character (!@#$%^&*)

## TOTP Details

- Algorithm: HMAC-SHA1
- Time step: 30 seconds
- Code length: 6 digits
- Acceptable window: ±2 time steps
