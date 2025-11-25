import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLanding from './pages/AdminLanding';
import FormBuilder from './pages/FormBuilder';
import SubmissionsList from './pages/SubmissionsList';
import PublicForms from './pages/PublicForms';
import FormRenderer from './pages/FormRenderer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicForms />} />
        <Route path="/form/:id" element={<FormRenderer />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/form-builder"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/form-builder/:id"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/submissions/:formId"
          element={
            <ProtectedRoute>
              <SubmissionsList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
