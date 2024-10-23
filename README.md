# Log Management System

This project is a Log Management System built with Node.js and Express. It provides functionality for user authentication, log creation, retrieval, and export.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/log-management-system.git
   cd log-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm start
   ```

## API Routes

### User Routes

- `POST /api/users/signup`: Register a new user
  - Body: `{ name, email, password, age }`

- `POST /api/users/login`: Login a user
  - Body: `{ email, password }`

- `POST /api/users/logout`: Logout a user (requires authentication)

- `GET /api/users/profile`: Get user profile (requires authentication)

### Log Routes

- `GET /api/logs`: Get logs (requires authentication)
  - Query parameters:
    - `page`: Page number for pagination
    - `limit`: Number of logs per page
    - `actionType`: Filter by action type
    - `startDate`: Filter logs from this date
    - `endDate`: Filter logs until this date
    - `includeDeleted`: Include soft-deleted logs
    - `userName`: Filter by username
    - `userRole`: Filter by user role
    - `userId`: Filter by user ID
    - `logId`: Filter by log ID
    - `objectId`: Search by log ID, user ID, or username

- `DELETE /api/logs/:id`: Soft delete a log (requires authentication)

- `GET /api/logs/export`: Export logs (requires authentication)
  - Query parameters:
    - `format`: 'json' or 'csv'
    - (All filter parameters from GET /api/logs are also applicable)

## Authentication

All routes except signup and login require a valid JWT token in the Authorization header:

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format.

## Logging

The system automatically logs user actions, including:
- User registration
- User login
- Log retrieval
- Log deletion

## Data Export

Users can export logs in either JSON or CSV format using the export endpoint.

## User Roles

- Regular users can only access and manage their own logs.
- Admin users have access to all logs and can perform all operations.

## Security

- Passwords are hashed before storing in the database.
- JWT is used for maintaining user sessions.
- Input validation is performed using Joi.

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- joi
- json2csv

  # DockerFile

  - docker build -t my-node-app .
  - docker run -p 3000:3000 my-node-app
  -docker-compose up --build



For a complete list of dependencies, refer to the `package.json` file.
