import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFormSubmissions, exportSubmissionsCSV } from '../services/apiService';
import { downloadCSV } from '../utils/validation';
import { UI_CONSTANTS } from '../utils/constants';

const SubmissionsList = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadSubmissions();
    }, [formId, currentPage]);

    const loadSubmissions = async () => {
        try {
            const response = await getFormSubmissions(formId, currentPage, UI_CONSTANTS.ITEMS_PER_PAGE);
            setSubmissions(response.submissions || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Error loading submissions:', error);
            alert('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const csvData = await exportSubmissionsCSV(formId);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `form_submissions_${formId}.csv`;
            document.body.appendChild(link);
            link.click(); document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export submissions');
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin/dashboard')}
                            className="mb-2"
                        >
                            ← Back to Dashboard
                        </Button>
                        <h1 className="text-4xl font-bold gradient-text">Form Submissions</h1>
                        <p className="text-gray-600 mt-1">
                            {pagination.total || 0} total submission{pagination.total !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {submissions.length > 0 && (
                        <Button onClick={handleExport}>
                            Export as CSV
                        </Button>
                    )}
                </div>

                {/* Submissions List */}
                {submissions.length === 0 ? (
                    <Card className="text-center py-16">
                        <p className="text-gray-500 text-xl">No submissions yet</p>
                        <p className="text-gray-400 mt-2">Submissions will appear here once users fill out the form</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <Card key={submission._id} className="animate-slide-up">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Submitted: {new Date(submission.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ID: {submission._id}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Version {submission.formVersion}
                                    </div>
                                </div>

                                {/* Submission Answers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(submission.answers.toObject ? submission.answers.toObject() : submission.answers || {}).map(([key, value]) => (
                                        <div key={key} className="border-l-2 border-primary-300 pl-3">
                                            <p className="text-sm font-medium text-gray-700">{key}</p>
                                            <p className="text-gray-600 mt-1">
                                                {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-gray-600">
                            Page {currentPage} of {pagination.pages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === pagination.pages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionsList;
