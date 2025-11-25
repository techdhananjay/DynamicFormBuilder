import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllForms, deleteForm } from '../services/apiService';
import { clearAuthData } from '../utils/auth';
import { ROUTES } from '../utils/constants';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const response = await getAllForms();
            setForms(response.forms || []);
        } catch (error) {
            console.error('Error loading forms:', error);
            setError('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (formId) => {
        if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteForm(formId);
            setForms(forms.filter(f => f._id !== formId));
        } catch (error) {
            console.error('Error deleting form:', error);
            alert('Failed to delete form');
        }
    };

    const handleLogout = () => {
        clearAuthData();
        navigate(ROUTES.ADMIN_LOGIN);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your dynamic forms</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            View Public Forms
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Create New Form Button */}
                <div className="mb-6">
                    <Button
                        onClick={() => navigate(ROUTES.FORM_BUILDER)}
                        size="lg"
                    >
                        + Create New Form
                    </Button>
                </div>

                {/* Forms Grid */}
                {forms.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-500 text-lg">No forms created yet</p>
                        <p className="text-gray-400 mt-2">Click "Create New Form" to get started</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <Card key={form._id} hover className="animate-slide-up">
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {form.title}
                                        </h3>
                                        {form.description && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {form.description}
                                            </p>
                                        )}
                                        <div className="flex gap-2 text-xs text-gray-500">
                                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                                v{form.version}
                                            </span>
                                            <span className={`px-2 py-1 rounded ${form.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {form.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            fullWidth
                                            onClick={() => navigate(`/admin/form-builder/${form._id}`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            fullWidth
                                            onClick={() => navigate(`/admin/submissions/${form._id}`)}
                                        >
                                            Submissions
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(form._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
