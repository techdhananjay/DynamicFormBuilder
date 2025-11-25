import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFormById, submitForm } from '../services/apiService';
import { validateForm } from '../utils/validation';

const FormRenderer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        loadForm();
    }, [id]);

    const loadForm = async () => {
        try {
            const response = await getFormById(id);
            setForm(response.form);
        } catch (error) {
            console.error('Error loading form:', error);
            alert('Failed to load form');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        // Clear error for this field
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateForm(form.fields, formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            await submitForm(form._id, formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Submit error:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || 'Failed to submit form');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="text-center py-12">
                    <p className="text-gray-500 text-xl">Form not found</p>
                    <Button onClick={() => navigate('/')} className="mt-6">
                        Back to Forms
                    </Button>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="text-center py-16 max-w-lg animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        Submission Successful!
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for completing the form. Your response has been recorded.
                    </p>
                    <Button onClick={() => navigate('/')}>
                        Back to Forms
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="mb-4"
                    >
                        ← Back to Forms
                    </Button>
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="text-gray-600 text-lg">{form.description}</p>
                    )}
                </div>

                {/* Form */}
                <Card className="animate-slide-up">
                    <form onSubmit={handleSubmit}>
                        {/* Render all fields */}
                        {form.fields
                            .sort((a, b) => a.order - b.order)
                            .map((field, index) => (
                                <FormField
                                    key={index}
                                    field={field}
                                    value={formData[field.name]}
                                    onChange={handleFieldChange}
                                    onNestedFieldChange={handleFieldChange}
                                    nestedFieldValues={formData}
                                    error={errors[field.name]}
                                />
                            ))}

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                loading={submitting}
                            >
                                Submit Form
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default FormRenderer;
