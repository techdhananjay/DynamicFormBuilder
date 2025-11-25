# Dynamic Form Builder - Backend API

Node.js backend API for the Dynamic Form Builder application.

## Features

- **Form Management**: Create, read, update, delete forms with dynamic fields
- **Field Types**: Support for text, textarea, number, email, date, checkbox, radio, select
- **Nested Fields**: Conditional fields based on radio/select selections
- **Validation**: Server-side validation with custom rules
- **Authentication**: JWT-based admin authentication
- **Submissions**: Store and retrieve form submissions with pagination
- **CSV Export**: Export form submissions as CSV files
- **Form Versioning**: Track form versions for historical submissions

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info (protected)

### Forms
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get single form
- `POST /api/forms` - Create form (protected)
- `PUT /api/forms/:id` - Update form (protected)
- `DELETE /api/forms/:id` - Delete form (protected)
- `PUT /api/forms/:id/reorder` - Reorder fields (protected)

### Submissions
- `POST /api/submissions` - Submit a form
- `GET /api/submissions/:formId` - Get form submissions (protected)
- `GET /api/submissions/detail/:id` - Get single submission (protected)
- `GET /api/submissions/:formId/export` - Export as CSV (protected)
- `DELETE /api/submissions/:id` - Delete submission (protected)

## Default Admin Credentials

- Username: `admin`
- Password: `admin`

⚠️ **Important**: Change these credentials after first login in production!

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dynamicforms
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
├── controllers/        # Request handlers
├── middleware/         # Auth and validation middleware
├── models/            # MongoDB schemas
├── routes/            # API routes
├── server.js          # Entry point
└── package.json
```
