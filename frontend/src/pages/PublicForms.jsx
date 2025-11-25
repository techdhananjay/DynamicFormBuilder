import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllForms } from '../services/apiService';

const PublicForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const response = await getAllForms(false); // Only active forms
            setForms(response.forms || []);
        } catch (error) {
            console.error('Error loading forms:', error);
            setError('Failed to load forms');
        } finally {
            setLoading(false);
        }
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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-bold gradient-text mb-4">
                        Available Forms
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Select a form to fill out and submit
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Forms Grid */}
                {forms.length === 0 ? (
                    <Card className="text-center py-16">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-xl">No forms available at the moment</p>
                        <p className="text-gray-400 mt-2">Please check back later</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <Link key={form._id} to={`/form/${form._id}`}>
                                <Card hover className="h-full animate-slide-up">
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                                {form.title}
                                            </h3>
                                            {form.description && (
                                                <p className="text-gray-600 line-clamp-3">
                                                    {form.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <div className="flex items-center text-primary-600 font-medium">
                                                <span>Fill out form</span>
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicForms;
