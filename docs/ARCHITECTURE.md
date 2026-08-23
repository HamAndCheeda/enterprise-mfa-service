# Enterprise MFA Service - Architecture

## System Overview

The Enterprise MFA Service is a modular, scalable authentication microservice designed for enterprise deployments.

## Components

### 1. API Layer (Express)

Handles HTTP requests and routes them to appropriate services.

```
GET/POST /api/auth/*
GET/POST /api/mfa/*
GET /api/audit/*
```

### 2. Authentication Service

Responsible for:
- User registration and validation
- Password hashing and verification
- Token generation and validation (JWT)
- Session management

**Key Functions:**
- `registerUser(email, password)`
- `loginUser(email, password)`
- `generateTokens(userId)`
- `verifyToken(token)`

### 3. MFA Service

Manages multi-factor authentication methods:

#### TOTP (Time-based One-Time Password)
- Uses speakeasy library
- 30-second time step
- 6-digit codes
- QR code generation for easy setup

#### SMS Verification
- Integration with SMS provider (Twilio)
- 5-minute code expiration
- Rate limiting to prevent abuse

#### Email Verification
- Sends verification codes via email
- SMTP configuration via environment variables
- HTML email templates

#### FIDO2/WebAuthn
- Hardware security key support
- Public key infrastructure
- Passwordless authentication capability

#### Backup Codes
- One-time use recovery codes
- Generated during MFA setup
- Stored encrypted in database

### 4. Middleware

#### Rate Limiter
- Global rate limiting: 100 req/15 min
- MFA rate limiting: 5 attempts/5 min
- Configurable via environment variables

#### Error Handler
- Centralized error handling
- Consistent error response format
- Development vs production error details

### 5. Data Layer

#### PostgreSQL
- User credentials and profiles
- MFA challenge records
- Audit logs
- Session data

#### Redis
- Session caching
- Rate limiting counters
- Challenge cache
- Temporary OTP storage

### 6. Utilities

#### Encryption
- AES-256-GCM for sensitive data
- Secure random code generation
- Password hashing with bcrypt

#### Validation
- Email validation
- Password strength requirements
- Phone number validation
- TOTP code format validation

#### Logging
- Winston logger integration
- Structured logging
- Multiple transports (console, file)
- Audit trail logging

## Data Flow

### User Registration Flow

```
1. Client sends registration request
   ↓
2. Express validates input
   ↓
3. AuthService validates password strength
   ↓
4. Password hashed with bcrypt
   ↓
5. User record created in PostgreSQL
   ↓
6. Response sent to client
```

### MFA Challenge Flow

```
1. User initiates MFA setup
   ↓
2. MFAService generates challenge
   ↓
3. Challenge stored in Redis (with expiration)
   ↓
4. Code sent via appropriate channel (SMS/Email/TOTP)
   ↓
5. User submits code
   ↓
6. Verify against stored challenge
   ↓
7. Update user record if successful
   ↓
8. Return authentication token
```

### Login with MFA Flow

```
1. User submits credentials
   ↓
2. AuthService validates password
   ↓
3. If MFA enabled:
   - Generate MFA challenge
   - Send code via configured method
   - Return to step 4
   ↓
4. User submits MFA code
   ↓
5. Verify code against challenge
   ↓
6. Generate JWT tokens
   ↓
7. Return tokens to client
   ↓
8. Client uses tokens for API access
```

## Security Considerations

### Password Security
- Bcrypt hashing with 10 salt rounds
- Strict password requirements
- No plaintext password storage

### Token Security
- JWT tokens with configurable expiry
- Short-lived access tokens (24h default)
- Longer-lived refresh tokens (7d default)
- Signature verification on each request

### Rate Limiting
- Prevents brute force attacks
- Separate limits for general API and MFA
- IP-based rate limiting

### Encryption
- AES-256-GCM for sensitive fields
- Random IV for each encryption
- Authentication tags for integrity

### Audit Logging
- All authentication events logged
- IP address and user agent captured
- Searchable by user and action
- Configurable retention period

## Scalability

### Horizontal Scaling
- Stateless API servers
- Shared Redis for sessions/rate limiting
- Shared PostgreSQL database
- Load balancer for traffic distribution

### Performance Optimization
- Redis caching for frequently accessed data
- Database connection pooling
- Async/await for non-blocking I/O
- Compression middleware

## Deployment

### Docker
- Containerized application
- PostgreSQL and Redis services
- Docker Compose for local development
- Multi-stage builds for production

### Environment Configuration
- All secrets via environment variables
- No hardcoded credentials
- Development/staging/production configs
- .env file support for local development

## Monitoring

### Logging
- Structured logging with Winston
- Multiple log levels (error, warn, info, debug)
- File and console outputs
- Searchable and indexable

### Audit Trail
- Complete authentication event history
- IP addresses and user agents
- Success/failure tracking
- User-specific audit logs
