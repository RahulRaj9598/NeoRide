# Backend API Documentation

## User Management System

### Tech Stack
- Node.js/Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- Express Validator for Input Validation

## API Endpoints

### User Registration
Endpoint for creating new user accounts with secure password hashing and JWT token generation.

#### Endpoint
```
POST /users/register
```

#### Request Body
```json
{
  "fullname": {
    "firstname": "string",    // required, min 3 chars
    "lastname": "string"      // optional, min 3 chars
  },
  "email": "string",         // required, unique
  "password": "string"       // required, min 6 chars
}
```

#### Validation Rules
- **firstname**: Required, minimum 3 characters
- **lastname**: Optional, minimum 3 characters if provided
- **email**: Required, must be valid email format and unique
- **password**: Required, minimum 6 characters

#### Success Response (201 Created)
```json
{
  "user": {
    "_id": "mongodb_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "jwt_auth_token"
}
```

#### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Status Codes
- **201**: User successfully created
- **400**: Validation errors or missing required fields

#### Example Request
```bash
curl -X POST http://localhost:3000/users/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "secure123"
}'
```

### User Login
Endpoint for authenticating existing users and generating JWT tokens.

#### Endpoint
```
POST /users/login
```

#### Request Body
```json
{
  "email": "string",     // required
  "password": "string"   // required
}
```

#### Validation Rules
- **email**: Required, must be valid email format
- **password**: Required, minimum 6 characters

#### Success Response (200 OK)
```json
{
  "user": {
    "_id": "mongodb_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "jwt_auth_token"
}
```

#### Error Responses

##### Validation Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

##### Authentication Error (401 Unauthorized)
```json
{
  "message": "Invalid Email or Password"
}
```

#### Status Codes
- **200**: Login successful
- **400**: Validation errors
- **401**: Invalid credentials

#### Example Request
```bash
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "secure123"
}'
```

#### Implementation Details
- Password is compared using bcrypt
- JWT token is generated on successful authentication
- User password is excluded from response
- Generic error messages for security

### Database Schema

#### User Model
```javascript
{
  fullname: {
    firstname: String,    // required, min 3 chars
    lastname: String,     // optional, min 3 chars
  },
  email: String,         // required, unique, min 5 chars
  password: String,      // required, stored as hashed
  socketId: String       // optional, for captain tracking
}
```

### Security Features
1. **Password Security**
   - Passwords are hashed using bcrypt with salt round 10
   - Passwords are excluded from query results by default
   - Password comparison method available for authentication

2. **Authentication**
   - JWT-based authentication
   - Tokens are generated using environment variable JWT_SECRET
   - Each user has methods for token generation and password comparison

3. **Input Validation**
   - Express-validator middleware for request validation
   - Validates email format
   - Enforces minimum length requirements
   - Custom error messages for validation failures

### Implementation Details
- User registration flow includes:
  1. Input validation
  2. Password hashing
  3. User creation in database
  4. JWT token generation
  5. Response with user data and token
- Service layer handles business logic
- Controller layer manages request/response cycle
- Model layer defines schema and database interactions
- Routes layer defines API endpoints and validation rules

### Error Handling
- Validation errors return 400 status code with detailed error messages
- Missing required fields are caught at both service and validation levels
- Duplicate email addresses are prevented by unique index

## Captain Management System

### Captain Registration
Endpoint for registering new captains with vehicle details.

#### Endpoint
```
POST /captain/register
```

#### Request Body
```json
{
  "fullname": {
    "firstname": "string",    // required, min 3 chars
    "lastname": "string"      // optional, min 3 chars
  },
  "email": "string",         // required, unique
  "password": "string",      // required, min 6 chars
  "vehicle": {
    "color": "string",       // required, min 3 chars
    "plate": "string",       // required, min 3 chars
    "capacity": "number",    // required, min 1
    "vehicleType": "string"  // required, enum: ['motorcycle','car','auto']
  }
}
```

#### Validation Rules
- **firstname**: Required, minimum 3 characters
- **lastname**: Optional, minimum 3 characters if provided
- **email**: Required, valid email format, unique
- **password**: Required, minimum 6 characters
- **vehicle.color**: Required, minimum 3 characters
- **vehicle.plate**: Required, minimum 3 characters
- **vehicle.capacity**: Required, numeric, minimum 1
- **vehicle.vehicleType**: Required, must be one of: motorcycle, car, auto

#### Success Response (201 Created)
```json
{
  "captain": {
    "_id": "mongodb_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  },
  "token": "jwt_auth_token"
}
```

### Captain Login
Endpoint for authenticating captains.

#### Endpoint
```
POST /captain/login
```

#### Request Body
```json
{
  "email": "string",     // required
  "password": "string"   // required
}
```

#### Success Response (200 OK)
```json
{
  "captain": {
    "_id": "mongodb_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  },
  "token": "jwt_auth_token"
}
```

### Captain Profile
Get captain's profile information.

#### Endpoint
```
GET /captain/profile
```

#### Headers
```
Authorization: Bearer jwt_auth_token
```

### Captain Logout
Endpoint for captain logout.

#### Endpoint
```
GET /captain/logout
```

#### Headers
```
Authorization: Bearer jwt_auth_token
```

### Captain Model Schema
```javascript
{
  fullname: {
    firstname: String,    // required, min 3 chars
    lastname: String,     // optional, min 3 chars
  },
  email: String,         // required, unique, lowercase
  password: String,      // required, stored as hashed
  socketId: String,      // optional
  status: String,        // enum: ['active','inactive'], default: 'inactive'
  vehicle: {
    color: String,       // required, min 3 chars
    plate: String,       // required, min 3 chars
    capacity: Number,    // required, min 1
    vehicleType: String  // required, enum: ['motorcycle','car','auto']
  },
  location: {
    lat: Number,        // optional
    lng: Number         // optional
  }
}
```

### Security Features
- All captain endpoints except login/register are protected with JWT authentication
- Password hashing using bcrypt
- Input validation using express-validator
- Token blacklisting on logout