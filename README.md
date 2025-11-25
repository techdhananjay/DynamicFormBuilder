# Dynamic Form Builder

A full-stack application for creating and managing dynamic forms with a React frontend and Node.js backend.

## Features

### Core Features
- ✅ Dynamic form creation with multiple field types
- ✅ Admin panel for form management
- ✅ Public form submission interface
- ✅ Field validation (client and server-side)
- ✅ Drag-and-drop field reordering
- ✅ **Nested fields** for radio/select options
- ✅ Form submission storage and retrieval
- ✅ CSV export of submissions
- ✅ JWT authentication for admin
- ✅ Form versioning
- ✅ Pagination for submissions

### Field Types Supported
- Text Input
- Text Area
- Number
- Email
- Date
- Checkbox
- Radio (with nested field support)
- Select Dropdown (with nested field support)

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CSV export functionality

### Frontend
- React 18 with Vite
- React Router DOM
- Tailwind CSS (premium design)
- Axios for API calls
- @dnd-kit for drag-and-drop
- Reusable components and utilities

## Quick Start

### Prerequisites
- Node.js (v22+)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Default Admin Credentials

- Username: `admin`  
- Password: `admin`

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
DynamicFormBuilder/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & validation
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── utils/      # Utilities & constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Forms
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get single form
- `POST /api/forms` - Create form (protected)
- `PUT /api/forms/:id` - Update form (protected)
- `DELETE /api/forms/:id` - Delete form (protected)
- `PUT /api/forms/:id/reorder` - Reorder fields (protected)

### Submissions
- `POST /api/submissions` - Submit form
- `GET /api/submissions/:formId` - Get submissions (protected)
- `GET /api/submissions/:formId/export` - Export CSV (protected)
- `DELETE /api/submissions/:id` - Delete submission (protected)

## Usage Guide

### Creating a Form

1. Login to admin panel at `/admin/login`
2. Click "Create New Form"
3. Enter form title and description
4. Add fields by clicking "+ Add Field"
5. Configure each field:
   - Set label and field name
   - Choose field type
   - Mark as required if needed
   - Add validation rules (optional)
   - For radio/select: add options and nested fields
6. Drag fields to reorder
7. Click "Create Form"

### Nested Fields Feature

For **radio** and **select** fields, you can add nested fields that appear conditionally:

1. When editing a radio/select field, add options
2. For each option, click "+ Add Nested Field"
3. Configure nested field (label, type)
4. Nested field will only show when that option is selected

Example use case: A "Country" select field with nested "State/Province" field that shows different options based on selected country.

### Submitting a Form

1. Visit the public forms page at `/`
2. Click on a form
3. Fill out all required fields
4. Nested fields will appear/hide based on your selections
5. Submit the form

### Viewing Submissions

1. From admin dashboard, click "Submissions" on any form
2. View all submissions with pagination
3. Export as CSV for analysis

## Design Philosophy

This project emphasizes:
- **Reusability**: Shared components, constants, and utilities
- **Premium UX**: Modern design with glassmorphism, animations, gradients
- **Code Organization**: Clear separation of concerns
- **Type Safety**: PropTypes for component props
- **Validation**: Both client and server-side validation

## Development Notes

- All constants are centralized in `frontend/src/utils/constants.js`
- API calls are centralized in `frontend/src/services/apiService.js`
- Reusable UI components in `frontend/src/components/`
- Backend follows MVC pattern
- MongoDB schemas enforce data integrity

## License

ISC
