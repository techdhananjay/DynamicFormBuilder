import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Input from './Input';
import { FIELD_TYPE_OPTIONS, FIELDS_REQUIRING_OPTIONS, FIELDS_WITH_NESTED_SUPPORT } from '../utils/constants';

const FieldEditor = ({ field, onSave, onCancel }) => {
    const [fieldData, setFieldData] = useState({
        label: field.label || '',
        name: field.name || '',
        type: field.type || 'text',
        required: field.required || false,
        options: field.options || [],
        validation: field.validation || {},
        order: field.order || 0,
    });

    const [errors, setErrors] = useState({});

    // Auto-generate name from label
    useEffect(() => {
        if (!fieldData.name && fieldData.label) {
            const generatedName = fieldData.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
            setFieldData(prev => ({ ...prev, name: generatedName }));
        }
    }, [fieldData.label]);

    const handleChange = (field, value) => {
        setFieldData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleValidationChange = (key, value) => {
        setFieldData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                [key]: value,
            },
        }));
    };

    const handleAddOption = () => {
        const newOption = {
            value: `option_${fieldData.options.length + 1}`,
            label: '',
            nestedFields: [],
        };
        setFieldData(prev => ({
            ...prev,
            options: [...prev.options, newOption],
        }));
    };

    const handleOptionChange = (index, key, value) => {
        const newOptions = [...fieldData.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        setFieldData(prev => ({ ...prev, options: newOptions }));
    };

    const handleDeleteOption = (index) => {
        setFieldData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }));
    };

    const handleAddNestedField = (optionIndex) => {
        const newNestedField = {
            label: '',
            name: '',
            type: 'text',
            required: false,
        };

        const newOptions = [...fieldData.options];
        if (!newOptions[optionIndex].nestedFields) {
            newOptions[optionIndex].nestedFields = [];
        }
        newOptions[optionIndex].nestedFields.push(newNestedField);
        setFieldData(prev => ({ ...prev, options: newOptions }));
    };

    const handleNestedFieldChange = (optionIndex, nestedIndex, key, value) => {
        const newOptions = [...fieldData.options];
        newOptions[optionIndex].nestedFields[nestedIndex] = {
            ...newOptions[optionIndex].nestedFields[nestedIndex],
            [key]: value,
        };

        // Auto-generate name for nested field
        if (key === 'label' && !newOptions[optionIndex].nestedFields[nestedIndex].name) {
            newOptions[optionIndex].nestedFields[nestedIndex].name = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
        }

        setFieldData(prev => ({ ...prev, options: newOptions }));
    };

    const handleDeleteNestedField = (optionIndex, nestedIndex) => {
        const newOptions = [...fieldData.options];
        newOptions[optionIndex].nestedFields = newOptions[optionIndex].nestedFields.filter(
            (_, i) => i !== nestedIndex
        );
        setFieldData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSave = () => {
        // Validate
        const newErrors = {};

        if (!fieldData.label.trim()) {
            newErrors.label = 'Label is required';
        }

        if (!fieldData.name.trim()) {
            newErrors.name = 'Field name is required';
        }

        if (FIELDS_REQUIRING_OPTIONS.includes(fieldData.type) && fieldData.options.length === 0) {
            newErrors.options = 'At least one option is required for this field type';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(fieldData);
    };

    const requiresOptions = FIELDS_REQUIRING_OPTIONS.includes(fieldData.type);
    const supportsNested = FIELDS_WITH_NESTED_SUPPORT.includes(fieldData.type);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold gradient-text">
                        {field.label ? 'Edit Field' : 'Add New Field'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Field Label"
                            name="label"
                            value={fieldData.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            placeholder="Enter field label"
                            required
                            error={errors.label}
                        />

                        <Input
                            label="Field Name"
                            name="name"
                            value={fieldData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="field_name"
                            required
                            error={errors.name}
                            helperText="Unique identifier for this field"
                        />
                    </div>

                    {/* Field Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Field Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={fieldData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {FIELD_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Required Checkbox */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={fieldData.required}
                            onChange={(e) => handleChange('required', e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Required field</span>
                    </label>

                    {/* Validation Rules */}
                    {(fieldData.type === 'text' || fieldData.type === 'textarea' || fieldData.type === 'number') && (
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-medium text-gray-800 mb-3">Validation Rules (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fieldData.type === 'number' ? (
                                    <>
                                        <Input
                                            label="Minimum Value"
                                            type="number"
                                            name="min"
                                            value={fieldData.validation?.min || ''}
                                            onChange={(e) => handleValidationChange('min', e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        <Input
                                            label="Maximum Value"
                                            type="number"
                                            name="max"
                                            value={fieldData.validation?.max || ''}
                                            onChange={(e) => handleValidationChange('max', e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            label="Minimum Length"
                                            type="number"
                                            name="min"
                                            value={fieldData.validation?.min || ''}
                                            onChange={(e) => handleValidationChange('min', e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        <Input
                                            label="Maximum Length"
                                            type="number"
                                            name="max"
                                            value={fieldData.validation?.max || ''}
                                            onChange={(e) => handleValidationChange('max', e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                    </>
                                )}
                                <Input
                                    label="Regex Pattern"
                                    name="regex"
                                    value={fieldData.validation?.regex || ''}
                                    onChange={(e) => handleValidationChange('regex', e.target.value)}
                                    placeholder="^[A-Z]{2}[0-9]{4}$"
                                    className="md:col-span-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    {requiresOptions && (
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-gray-800">Options</h3>
                                <Button size="sm" onClick={handleAddOption}>
                                    + Add Option
                                </Button>
                            </div>

                            {errors.options && (
                                <p className="text-sm text-red-600 mb-2">{errors.options}</p>
                            )}

                            <div className="space-y-3">
                                {fieldData.options.map((option, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <Input
                                                label="Value"
                                                name={`option-value-${index}`}
                                                value={option.value}
                                                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                                                placeholder="option_value"
                                                required
                                            />
                                            <Input
                                                label="Label"
                                                name={`option-label-${index}`}
                                                value={option.label}
                                                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                                placeholder="Display Label"
                                                required
                                            />
                                        </div>

                                        {/* Nested Fields Section */}
                                        {supportsNested && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-xs font-medium text-gray-600">
                                                        Nested Fields (shown when this option is selected)
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleAddNestedField(index)}
                                                    >
                                                        + Add Nested Field
                                                    </Button>
                                                </div>

                                                {option.nestedFields && option.nestedFields.length > 0 && (
                                                    <div className="space-y-2 mt-2">
                                                        {option.nestedFields.map((nestedField, nestedIndex) => (
                                                            <div key={nestedIndex} className="bg-blue-50 p-2 rounded flex gap-2 items-start">
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={nestedField.label}
                                                                        onChange={(e) => handleNestedFieldChange(index, nestedIndex, 'label', e.target.value)}
                                                                        placeholder="Label"
                                                                        className="px-2 py-1 text-sm rounded border border-gray-300"
                                                                    />
                                                                    <select
                                                                        value={nestedField.type}
                                                                        onChange={(e) => handleNestedFieldChange(index, nestedIndex, 'type', e.target.value)}
                                                                        className="px-2 py-1 text-sm rounded border border-gray-300"
                                                                    >
                                                                        <option value="text">Text</option>
                                                                        <option value="number">Number</option>
                                                                        <option value="email">Email</option>
                                                                        <option value="date">Date</option>
                                                                    </select>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteNestedField(index, nestedIndex)}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDeleteOption(index)}
                                            className="mt-2"
                                        >
                                            Remove Option
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Field
                    </Button>
                </div>
            </div>
        </div>
    );
};

FieldEditor.propTypes = {
    field: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default FieldEditor;
