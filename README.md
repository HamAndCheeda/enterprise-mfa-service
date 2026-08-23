# Enterprise MFA Service

A scalable, production-grade multi-factor authentication (MFA) service designed for enterprise deployments. Supports TOTP, SMS, email, and hardware security keys with comprehensive audit logging, rate limiting, and compliance features.

## Features

- **Multiple Authentication Methods**
  - Time-based One-Time Password (TOTP)
  - SMS verification
  - Email verification
  - Hardware security keys (FIDO2)
  - Backup codes

- **Enterprise-Ready**
  - User and organization management
  - Role-based access control (RBAC)
  - Comprehensive audit logging
  - Rate limiting and brute-force protection
  - Session management

- **Security**
  - End-to-end encryption for sensitive data
  - Secure token generation and validation
  - HMAC-based request signing
  - Protection against timing attacks

- **Developer-Friendly**
  - RESTful API
  - Comprehensive documentation
  - Docker support
  - Extensive test coverage

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

### Installation

```bash
git clone https://github.com/HamAndCheeda/enterprise-mfa-service.git
cd enterprise-mfa-service
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup

```bash
npm run db:migrate
npm run db:seed
```

### Running Locally

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Docker

```bash
docker-compose up -d
```

## API Documentation

See [API.md](./docs/API.md) for comprehensive endpoint documentation.

### Authentication Flow

1. User initiates login with credentials
2. System verifies primary authentication
3. MFA challenge is issued
4. User submits MFA verification code/response
5. System validates MFA and returns session token
6. User is authenticated

## Architecture

```
src/
├── controllers/     HTTP request handlers
├── services/        Business logic layer
├── middleware/      Express middleware
├── models/          Data models and schemas
├── utils/           Utility functions
├── config/          Configuration management
└── types/           TypeScript type definitions
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Project Structure

- `src/` - Application source code
- `tests/` - Unit and integration tests
- `docs/` - API and architecture documentation
- `migrations/` - Database migration files

## Security Considerations

- All secrets should be stored in environment variables
- Database connections use SSL/TLS
- API endpoints require authentication
- Rate limiting is enforced on all public endpoints
- Audit logging captures all authentication events

## Contributing

1. Create a feature branch
2. Make changes and add tests
3. Ensure all tests pass: `npm test`
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
