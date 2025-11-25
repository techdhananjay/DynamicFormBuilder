import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import FieldEditor from '../components/FieldEditor';
import DraggableField from '../components/DraggableField';
import { getFormById, createForm, updateForm } from '../services/apiService';
import { FIELD_TYPES } from '../utils/constants';

const FormBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);

    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [editingField, setEditingField] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (id) {
            loadForm();
        }
    }, [id]);

    const loadForm = async () => {
        try {
            const response = await getFormById(id);
            const form = response.form;
            setFormTitle(form.title);
            setFormDescription(form.description || '');
            setFields(form.fields || []);
        } catch (error) {
            console.error('Error loading form:', error);
            alert('Failed to load form');
        } finally {
            setLoading(false);
        }
    };

    const handleAddField = () => {
        const newField = {
            label: '',
            name: '',
            type: FIELD_TYPES.TEXT,
            required: false,
            options: [],
            validation: {},
            order: fields.length,
        };
        setEditingField(newField);
        setEditingIndex(null); // null means adding new
    };

    const handleEditField = (index) => {
        setEditingField({ ...fields[index] });
        setEditingIndex(index);
    };

    const handleDeleteField = (index) => {
        if (confirm('Are you sure you want to delete this field?')) {
            const newFields = fields.filter((_, i) => i !== index);
            // Update order
            const reorderedFields = newFields.map((field, idx) => ({
                ...field,
                order: idx,
            }));
            setFields(reorderedFields);
        }
    };

    const handleSaveField = (field) => {
        if (editingIndex !== null) {
            // Update existing field
            const newFields = [...fields];
            newFields[editingIndex] = field;
            setFields(newFields);
        } else {
            // Add new field
            setFields([...fields, { ...field, order: fields.length }]);
        }
        setEditingField(null);
        setEditingIndex(null);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((item, index) => index === parseInt(active.id));
                const newIndex = items.findIndex((item, index) => index === parseInt(over.id));

                const newArray = arrayMove(items, oldIndex, newIndex);

                // Update order property
                return newArray.map((field, idx) => ({
                    ...field,
                    order: idx,
                }));
            });
        }
    };

    const handleSaveForm = async () => {
        // Validate
        if (!formTitle.trim()) {
            alert('Please enter a form title');
            return;
        }

        if (fields.length === 0) {
            alert('Please add at least one field');
            return;
        }

        // Check for duplicate field names
        const fieldNames = fields.map(f => f.name);
        const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
            alert(`Duplicate field names found: ${duplicates.join(', ')}`);
            return;
        }

        setSaving(true);

        try {
            const formData = {
                title: formTitle,
                description: formDescription,
                fields,
            };

            if (id) {
                await updateForm(id, formData);
                alert('Form updated successfully!');
            } else {
                await createForm(formData);
                alert('Form created successfully!');
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Save error:', error);
            alert(error.response?.data?.message || 'Failed to save form');
        } finally {
            setSaving(false);
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
                        <h1 className="text-4xl font-bold gradient-text">
                            {id ? 'Edit Form' : 'Create New Form'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveForm}
                            loading={saving}
                        >
                            {id ? 'Update Form' : 'Create Form'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Settings */}
                    <div className="lg:col-span-1">
                        <Card className="animate-slide-up sticky top-6">
                            <h2 className="text-xl font-semibold mb-4">Form Settings</h2>

                            <Input
                                label="Form Title"
                                name="title"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Enter form title"
                                required
                                className="mb-4"
                            />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Enter form description (optional)"
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>{fields.length}</strong> field{fields.length !== 1 ? 's' : ''} added
                                </p>
                                <Button
                                    onClick={handleAddField}
                                    variant="secondary"
                                    fullWidth
                                >
                                    + Add Field
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Fields List */}
                    <div className="lg:col-span-2">
                        <Card className="animate-slide-up">
                            <h2 className="text-xl font-semibold mb-4">Form Fields</h2>

                            {fields.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500">No fields added yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Click "Add Field" to get started</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={fields.map((_, index) => index.toString())}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <DraggableField
                                                    key={index}
                                                    id={index.toString()}
                                                    field={field}
                                                    index={index}
                                                    onEdit={() => handleEditField(index)}
                                                    onDelete={() => handleDeleteField(index)}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Field Editor Modal */}
                {editingField && (
                    <FieldEditor
                        field={editingField}
                        onSave={handleSaveField}
                        onCancel={() => {
                            setEditingField(null);
                            setEditingIndex(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default FormBuilder;
