# Flight Authentication Service

A microservice for user authentication and management in the Flight Booking Application ecosystem. This service acts as both an authentication service and an API gateway, handling user registration, login, JWT-based authentication, and proxying requests to other microservices.

## Features

- **User Registration** - Secure user signup with password hashing
- **User Authentication** - JWT-based login system
- **API Gateway** - Request proxying to Flight Service and Booking Service
- **Rate Limiting** - Protection against abuse (100 requests per 5 minutes per IP)
- **Input Validation** - Zod schema validation for all inputs
- **Password Security** - Bcrypt hashing with configurable salt rounds
- **Error Handling** - Comprehensive error handling with proper HTTP status codes
- **Logging** - Winston-based logging system
- **Database** - MySQL with Sequelize ORM

## Architecture

```
src/
├── config/          # Configuration files (server, logger)
├── controllers/     # Request handlers
├── middlewares/     # Authentication and validation middleware
├── migrations/      # Database migrations
├── models/          # Sequelize models
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
└── utils/           # Utility functions and error handlers
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & ORM**: MySQL, Sequelize
- **Authentication & Validation**: JWT + Bcrypt, Zod
- **API Gateway**: http-proxy-middleware
- **Rate Limiting**: express-rate-limit
- **Logging**: Winston
- **HTTP Status**: http-status-codes

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Flight-Auth-service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flight_auth_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=24h

# Security Configuration
SALT_ROUNDS=10

# Microservice URLs
FLIGHT_SERVICE=http://localhost:4000
```

### 4. Database Setup
```bash
# Run migrations
npx sequelize-cli db:migrate

# (Optional) Run seeders
npx sequelize-cli db:seed:all
```

### 5. Start the Service
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The service will be available at `http://localhost:3000`

## API Gateway Routes

This service also acts as an API gateway, forwarding requests to other microservices:

- **Flight Service**: `/flightservice/*` → Proxies to `FLIGHT_SERVICE` environment variable
- **Booking Service**: `/bookingservice/*` → Proxies to `https://localhost:5500/`

All requests to these routes are automatically forwarded to their respective services with origin change enabled.

## Rate Limiting

The service implements rate limiting to protect against abuse:
- **Limit**: 100 requests per IP address
- **Window**: 5 minutes
- **Scope**: Applied to all incoming requests

When the rate limit is exceeded, the service will return a `429 Too Many Requests` status code.

## API Documentation

### Base URL
```
http://localhost:3000/api/users
```

### Endpoints

#### 1. User Registration
```http
POST /api/users/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "DoB": "1990-01-01"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "DoB": "1990-01-01",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. User Login
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Authentication successful!",
  "data": {
    "bearer": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "message": "Detailed error message",
    "StatusCode": 400
  }
}
```

## Authentication

### JWT Token Usage
Include the JWT token in the request headers:

```http
Authorization: Bearer <your_jwt_token>
```

### Protected Routes
Some endpoints require authentication. Use the `isAuthenticated` middleware for protected routes.

## Database Schema

### Users Table
| Field      | Type         | Constraints           |
|------------|--------------|----------------------|
| id         | INTEGER      | Primary Key, Auto Increment |
| email      | VARCHAR      | Unique, Not Null     |
| password   | VARCHAR      | Not Null             |
| DoB        | DATE         | Optional              |
| createdAt  | DATETIME     | Not Null             |
| updatedAt  | DATETIME     | Not Null             |

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Environment Variables

| Variable      | Description                    | Default | Required |
|---------------|--------------------------------|---------|----------|
| PORT          | Server port number            | 3000    | Yes      |
| NODE_ENV      | Environment (dev/prod)        | dev     | No       |
| DB_HOST       | Database host                 | localhost| Yes      |
| DB_PORT       | Database port                 | 3306    | Yes      |
| DB_NAME       | Database name                 | -       | Yes      |
| DB_USERNAME   | Database username             | -       | Yes      |
| DB_PASSWORD   | Database password             | -       | Yes      |
| JWT_SECRET    | JWT signing secret            | -       | Yes      |
| JWT_EXPIRY   | JWT token expiry time        | 24h     | Yes      |
| SALT_ROUNDS   | Bcrypt salt rounds           | 10      | Yes      |
| FLIGHT_SERVICE | Flight service URL for proxying | - | Yes      |

## Deployment

### Production Build
```bash
# Install production dependencies only
npm ci --only=production

# Start production server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Development

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
```

### Code Structure
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access operations
- **Middlewares**: Authentication and validation logic
- **Models**: Database schema definitions
- **Utils**: Helper functions and error handlers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Mihir Dongare** - Developer

## 🔗 Related Services

This service is part of a larger Flight Booking Application ecosystem:
- **Flight Search Service** - Flight availability and search
- **Booking Service** - Reservation management
- **Payment Service** - Payment processing
- **Notification Service** - Email/SMS notifications


**Note**: This service is designed to work independently but can be integrated with other microservices in the Flight Booking Application ecosystem.
