# Office Management System Backend

A complete REST API backend for Office Management System built with Node.js, Express.js, TypeScript, and MongoDB.

## Features

- **JWT Authentication**: Secure admin authentication with bcrypt password hashing
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for departments and employees
- **Advanced Filtering**: Employee filtering by department, job title, and search functionality
- **Pagination**: Efficient data pagination for large datasets
- **External API Integration**: Dynamic location data (countries, states, cities) from external APIs
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling with meaningful error messages
- **TypeScript**: Full type safety throughout the application
- **MVC Architecture**: Clean separation of concerns with controllers, models, and routes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Validation**: Express Validator
- **External API**: CountriesNow API for location data

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values according to your setup

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/office-management
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
COUNTRIES_API_URL=https://countriesnow.space/api/v0.1
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Protected)
- `PUT /api/departments/:id` - Update department (Protected)
- `DELETE /api/departments/:id` - Delete department (Protected)

### Employees
- `GET /api/employees` - Get employees with pagination, filtering, and search
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Protected)
- `PUT /api/employees/:id` - Update employee (Protected)
- `DELETE /api/employees/:id` - Delete employee (Protected)

### Locations
- `GET /api/locations/countries` - Get all countries
- `GET /api/locations/states/:country` - Get states for a country
- `GET /api/locations/cities/:country/:state` - Get cities for a state

### Query Parameters for Employees

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `department`: Filter by department ID
- `jobTitle`: Filter by job title (partial match)
- `search`: Search in name and email fields

Example: `/api/employees?page=1&limit=10&department=603f7c47b5d0c90015f8b8a1&search=john`

## Data Models

### Admin
```typescript
{
  email: string,
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Department
```typescript
{
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Employee
```typescript
{
  name: string,
  email: string,
  departmentId: ObjectId,
  supervisorId?: ObjectId,
  jobTitle: string,
  location: {
    country: string,
    state: string,
    city: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

All write operations (POST, PUT, DELETE) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this consistent format:

```typescript
{
  success: boolean,
  message: string,
  data?: any,
  error?: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

## Postman Collection

Import the `postman-collection.json` file into Postman to test all API endpoints. The collection includes:

- Environment variables setup
- Authentication flow with automatic token handling
- All CRUD operations with sample data
- Location API endpoints

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Error Handling

The application includes comprehensive error handling for:

- Validation errors
- Authentication errors
- Database errors (duplicate keys, cast errors, etc.)
- External API errors
- Generic server errors

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT token expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting ready (can be added)

## Development Notes

1. **Database Connection**: Ensure MongoDB is running before starting the server
2. **External API**: The location API is used for validating employee locations
3. **Admin Creation**: Use the `/api/auth/register` endpoint to create the first admin user
4. **Environment**: The app automatically creates necessary indexes on startup

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Use a strong JWT secret
5. Enable MongoDB authentication
6. Consider adding rate limiting and additional security measures

## Support

For questions or issues, please refer to the API documentation or check the error messages returned by the endpoints.