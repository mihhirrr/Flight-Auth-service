# Flight Auth Service - API Documentation

## Base Information

- **Base URL**: `/api`
- **Rate Limiting**: 100 requests per 5 minutes per IP address
- **Content-Type**: `application/json`
- **Response Format**: All responses follow a consistent structure with `success`, `message`, `data`, and `error` fields

---

## Response Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Request fulfilled",
  "data": {},
  "error": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {}
}
```

---

## Authentication Routes

### 1. User Signup

**Endpoint**: `POST /api/users/signup`

**Description**: Creates a new user account with email, password, and date of birth. Automatically assigns the "CUSTOMER" profile to the new user.

**Middleware**: `UserMiddleware.Auth` - Validates that email and password are provided

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "DoB": "1990-01-15"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `email` | string | Yes | User's email address | Must be a valid email format, unique |
| `password` | string | Yes | User's password | Cannot be empty |
| `DoB` | string (date) | No | Date of Birth | Format: YYYY-MM-DD (DATEONLY) |

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": true,
  "error": {}
}
```

**Error Responses**:

- **400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Unable to create user!",
  "data": {},
  "error": {
    "message": "Validation error message",
    "StatusCode": 400
  }
}
```

- **400 Bad Request** - Email Already Exists:
```json
{
  "success": false,
  "message": "Unable to create user!",
  "data": {},
  "error": {
    "message": "Email already exists. Please try with different email.",
    "StatusCode": 400
  }
}
```

- **400 Bad Request** - Missing Email/Password:
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": "Both Email and Password are required"
}
```

- **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Unable to create user!",
  "data": {},
  "error": {
    "message": "An error occured during Sign up! Please retry.",
    "StatusCode": 500
  }
}
```

**Notes**:
- Password is automatically hashed using bcrypt before storage
- User is automatically assigned the "CUSTOMER" profile upon creation
- Email must be unique across all users

---

### 2. User Login

**Endpoint**: `POST /api/users/login`

**Description**: Authenticates a user with email and password, returns a JWT token for subsequent authenticated requests.

**Middleware**: `UserMiddleware.Auth` - Validates that email and password are provided

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Authentication successful!",
  "data": {
    "bearer": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": {}
}
```

**Error Responses**:

- **400 Bad Request** - Missing Email/Password:
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": "Both Email and Password are required"
}
```

- **404 Not Found** - User Not Found:
```json
{
  "success": false,
  "message": "Failed Authentication!",
  "data": {},
  "error": {
    "message": "User not found with specified email address.",
    "StatusCode": 404
  }
}
```

- **401 Unauthorized** - Incorrect Password:
```json
{
  "success": false,
  "message": "Failed Authentication!",
  "data": {},
  "error": {
    "message": "Authentication Failed! Incorrect password.",
    "StatusCode": 401
  }
}
```

- **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Failed Authentication!",
  "data": {},
  "error": {
    "message": "Error message",
    "StatusCode": 500
  }
}
```

**Notes**:
- JWT token expires based on `JWT_EXPIRY` configuration
- Token should be included in subsequent requests using the `token` header
- Token payload contains the user's `email` and `id` fields

---

### 3. Add Staff Member

**Endpoint**: `POST /api/staff/addnew`

**Description**: Creates a new staff account with email and password. Automatically assigns the "STAFF" profile to the new user. This endpoint is used by administrators to add new staff members to the system.

**Middleware**: 
- `UserMiddleware.Auth` - Validates that email and password are provided
- `UserMiddleware.isAdmin` - Validates JWT token authentication and verifies the user has ADMIN profile (requires `token` header)

**Headers Required**:
- `token`: JWT token received from login endpoint (required for admin authentication)

**Request Body**:
```json
{
  "email": "staff@example.com",
  "password": "securePassword123"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `email` | string | Yes | Staff member's email address | Must be a valid email format, unique |
| `password` | string | Yes | Staff member's password | Cannot be empty |

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Staff account created successfully",
  "data": "staff@example.com",
  "error": {}
}
```

**Error Responses**:

- **400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Unable to add new staff!",
  "data": {},
  "error": {
    "message": "Validation error message",
    "StatusCode": 400
  }
}
```

- **400 Bad Request** - Email Already Exists:
```json
{
  "success": false,
  "message": "Unable to add new staff!",
  "data": {},
  "error": {
    "message": "Email already exists. Please try with different email.",
    "StatusCode": 400
  }
}
```

- **400 Bad Request** - Missing Email/Password:
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": "Both Email and Password are required"
}
```

- **400 Bad Request** - Token Not Found (from isAdmin middleware):
```json
{
  "success": false,
  "message": "Please login to access this resourse!",
  "data": {},
  "error": {
    "message": "Token not found!"
  }
}
```

- **401 Unauthorized** - User is not an admin (from isAdmin middleware):
```json
{
  "success": false,
  "message": "You are not an admin!",
  "data": {},
  "error": {
    "message": "You are not an admin!",
    "StatusCode": 401
  }
}
```

- **422 Unprocessable Entity** - Token Expired or Invalid (from isAdmin middleware):
```json
{
  "success": false,
  "message": "Session expired! Please login again!",
  "data": {},
  "error": "TokenExpiredError"
}
```

- **422 Unprocessable Entity** - Invalid Token (from isAdmin middleware):
```json
{
  "success": false,
  "message": "Invalid Token!",
  "data": {},
  "error": "JsonWebTokenError"
}
```

- **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Unable to add new staff!",
  "data": {},
  "error": {
    "message": "An error occured during Sign up! Please retry.",
    "StatusCode": 500
  }
}
```

**Notes**:
- Password is automatically hashed using bcrypt before storage
- Staff member is automatically assigned the "STAFF" profile upon creation
- Email must be unique across all users
- Unlike user signup, this endpoint does not require a date of birth (DoB) field
- Requires authentication via JWT token in the `token` header
- The `isAdmin` middleware validates the token and verifies that the authenticated user has the ADMIN profile
- Only users with ADMIN profile can create staff accounts

---

## Protected Route Middleware

### Authentication Middleware (`isAuthenticated`)

**Usage**: Can be applied to routes that require authentication. Validates JWT token and allows access if token is valid.

**Header Required**:
- `token`: JWT token received from login endpoint (contains `email` and `id`)

**Error Responses**:

- **400 Bad Request** - Token Not Found:
```json
{
  "success": false,
  "message": "Please login to access this resourse!",
  "data": {},
  "error": {
    "message": "Token not found!"
  }
}
```

- **422 Unprocessable Entity** - Token Expired:
```json
{
  "success": false,
  "message": "Session expired! Please login again!",
  "data": {},
  "error": "TokenExpiredError"
}
```

- **422 Unprocessable Entity** - Invalid Token:
```json
{
  "success": false,
  "message": "Invalid Token!",
  "data": {},
  "error": "JsonWebTokenError"
}
```

---

### Admin Authorization Middleware (`isAdmin`)

**Usage**: Can be applied to routes that require admin privileges. Validates JWT token and verifies the user has ADMIN profile. This middleware checks both token validity and user profile assignment.

**Header Required**:
- `token`: JWT token received from login endpoint (contains `email` and `id`)

**Error Responses**:

- **400 Bad Request** - Token Not Found:
```json
{
  "success": false,
  "message": "Please login to access this resourse!",
  "data": {},
  "error": {
    "message": "Token not found!"
  }
}
```

- **401 Unauthorized** - User is not an admin:
```json
{
  "success": false,
  "message": "You are not an admin!",
  "data": {},
  "error": {
    "message": "You are not an admin!",
    "StatusCode": 401
  }
}
```

- **422 Unprocessable Entity** - Token Expired:
```json
{
  "success": false,
  "message": "Session expired! Please login again!",
  "data": {},
  "error": "TokenExpiredError"
}
```

- **422 Unprocessable Entity** - Invalid Token:
```json
{
  "success": false,
  "message": "Invalid Token!",
  "data": {},
  "error": "JsonWebTokenError"
}
```

**Notes**:
- This middleware performs two checks: token validation and admin profile verification
- The middleware queries the database to fetch user profiles and checks if ADMIN profile is assigned
- Only users with ADMIN profile can access routes protected by this middleware
```json
{
  "success": false,
  "message": "Please login to access this resourse!",
  "data": {},
  "error": {
    "message": "Token not found!"
  }
}
```

- **422 Unprocessable Entity** - Token Expired:
```json
{
  "success": false,
  "message": "Session expired! Please login again!",
  "data": {},
  "error": "TokenExpiredError"
}
```

- **422 Unprocessable Entity** - Invalid Token:
```json
{
  "success": false,
  "message": "Invalid Token!",
  "data": {},
  "error": "JsonWebTokenError"
}
```

---

## Proxy Routes

The service also acts as a proxy gateway for other microservices:

### Flight Service Proxy
- **Base Path**: `/flightservice`
- **Target**: Configured via `FLIGHT_SERVICE` environment variable
- **Description**: Proxies requests to the Flight Service microservice

### Booking Service Proxy
- **Base Path**: `/bookingservice`
- **Target**: Configured via `BOOKING_SERVICE` environment variable
- **Description**: Proxies requests to the Booking Service microservice

**Note**: These proxy routes rewrite the path by removing the service prefix before forwarding to the target service.

---

## Data Models

### User Model
```javascript
{
  email: String (unique, required, validated as email),
  password: String (required, hashed with bcrypt),
  DoB: Date (optional, DATEONLY format)
}
```

### User Profiles
Users can have multiple profiles assigned:
- `admin` - Administrator profile
- `customer` - Customer profile (default for new users)
- `staff` - Staff profile

---

## Rate Limiting

- **Window**: 5 minutes
- **Limit**: 100 requests per IP address
- **Scope**: Applied to all routes globally
- **Headers**: Standard rate limit headers are included in responses

---

## Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port number |
| `SALT_ROUNDS` | Number of bcrypt salt rounds for password hashing |
| `JWT_SECRET` | Secret key for JWT token signing |
| `JWT_EXPIRY` | JWT token expiration time (e.g., "1h", "24h") |
| `FLIGHT_SERVICE` | URL of the Flight Service microservice |
| `BOOKING_SERVICE` | URL of the Booking Service microservice |

---

## Example Usage

### Signup Flow
```bash
curl -X POST http://localhost:PORT/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "DoB": "1990-05-15"
  }'
```

### Login Flow
```bash
curl -X POST http://localhost:PORT/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

### Add Staff Member Flow
```bash
curl -X POST http://localhost:PORT/api/staff/addnew \
  -H "Content-Type: application/json" \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "staff.member@example.com",
    "password": "SecureStaffPass123"
  }'
```

### Using Token for Protected Routes
```bash
curl -X GET http://localhost:PORT/api/protected-route \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Error Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or missing required fields |
| 401 | Unauthorized - Authentication failed (incorrect password) or insufficient privileges (not admin) |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Token validation failed |
| 500 | Internal Server Error - Server-side error |

---

## Notes

1. All passwords are hashed using bcrypt before storage
2. JWT tokens are used for authentication and contain `email` and `id` fields
3. New users are automatically assigned the "CUSTOMER" profile
4. New staff members are automatically assigned the "STAFF" profile
5. Email addresses must be unique across the system
6. Rate limiting is applied globally to prevent abuse (100 requests per 5 minutes per IP)
7. The service acts as a gateway for Flight and Booking microservices
8. The `isAdmin` middleware checks both token validity and ADMIN profile assignment
9. Token validation errors are specifically handled (TokenExpiredError, JsonWebTokenError)

