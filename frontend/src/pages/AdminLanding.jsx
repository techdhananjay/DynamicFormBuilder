import { useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthData } from '../utils/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import { ROUTES } from '../utils/constants';

const AdminLanding = () => {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();

    const handleLogout = () => {
        clearAuthData();
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-5xl font-bold gradient-text mb-4">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {authenticated ? 'Choose an action' : 'Please login to continue'}
                    </p>
                </div>

                <Card className="animate-slide-up">
                    {!authenticated ? (
                        // Not logged in - show login button
                        <div className="text-center py-8">
                            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-gray-600 mb-6">
                                You need to be logged in to access the admin panel
                            </p>
                            <Button
                                onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
                                size="lg"
                            >
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        // Logged in - show all admin page buttons
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Admin Actions</h2>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Dashboard */}
                                <button
                                    onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                            <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Dashboard</h3>
                                    <p className="text-sm text-gray-600">View and manage all forms</p>
                                </button>

                                {/* Form Builder */}
                                <button
                                    onClick={() => navigate(ROUTES.FORM_BUILDER)}
                                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                            <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Create New Form</h3>
                                    <p className="text-sm text-gray-600">Build a form with drag & drop</p>
                                </button>

                                {/* View Public Forms */}
                                <button
                                    onClick={() => navigate(ROUTES.HOME)}
                                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                            <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">View Public Forms</h3>
                                    <p className="text-sm text-gray-600">See forms as users see them</p>
                                </button>

                                {/* Back to Home */}
                                <button
                                    onClick={() => navigate(ROUTES.HOME)}
                                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                            <svg className="w-6 h-6 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Go to Home</h3>
                                    <p className="text-sm text-gray-600">Return to main page</p>
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminLanding;
