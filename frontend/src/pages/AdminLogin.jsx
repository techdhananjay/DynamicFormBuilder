import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { loginAdmin } from '../services/apiService';
import { setAuthData } from '../utils/auth';
import { ROUTES } from '../utils/constants';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await loginAdmin(formData.username, formData.password);

            if (response.success) {
                setAuthData(response.token, response.admin);
                navigate(ROUTES.ADMIN_DASHBOARD);
            } else {
                setErrors({ general: response.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: error.response?.data?.message || 'Login failed. Please check your credentials.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        Form Builder
                    </h1>
                    <p className="text-gray-600">Admin Panel Login</p>
                </div>

                <Card className="animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            error={errors.username}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            error={errors.password}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                        >
                            Login
                        </Button>

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Default credentials: admin / admin
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
