# Dynamic Form Builder - Frontend

React frontend application for the Dynamic Form Builder.

## Features

- **Admin Panel**: Create, edit, and manage dynamic forms
- **Drag & Drop**: Reorder form fields with intuitive drag-and-drop
- **Field Types**: Support for text, textarea, number, email, date, checkbox, radio, select
- **Nested Fields**: Conditional fields based on radio/select selections
- **Public Forms**: Browse and submit available forms
- **Real-time Validation**: Client-side validation matching backend rules
- **Premium UI**: Modern design with Tailwind CSS, glassmorphism, and animations

## Tech Stack

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- @dnd-kit (drag and drop)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── FormField.jsx
│   │   ├── Card.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── FieldEditor.jsx
│   │   └── DraggableField.jsx
│   ├── pages/           # Page components
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── FormBuilder.jsx
│   │   ├── SubmissionsList.jsx
│   │   ├── PublicForms.jsx
│   │   └── FormRenderer.jsx
│   ├── services/        # API services
│   │   └── apiService.js
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── validation.js
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features

### Reusable Components
- All UI components are modular and reusable
- Shared constants for field types, API endpoints, validation messages
- Centralized API service for all backend calls
- Utility functions for validation, auth, and data formatting

### Form Builder
- Visual form builder with drag-and-drop field reordering
- Support for all field types
- Nested field configuration for radio/select options
- Validation rule configuration

### Public Forms
- Browse available forms
- Dynamic form rendering based on field definitions
- Client-side validation before submission
- Success feedback after submission

## Default Admin Credentials

- Username: `admin`
- Password: `admin`
