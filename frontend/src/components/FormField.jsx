import PropTypes from 'prop-types';
import { FIELD_TYPES } from '../utils/constants';

const FormField = ({
    field,
    value,
    onChange,
    error,
    onNestedFieldChange,
    nestedFieldValues = {}
}) => {
    const { label, name, type, required, options, validation } = field;

    const baseInputClasses = `
    w-full px-4 py-2.5 rounded-lg border-2
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-primary-400'}
  `;

    const renderField = () => {
        switch (type) {
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.EMAIL:
            case FIELD_TYPES.NUMBER:
            case FIELD_TYPES.DATE:
                return (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(name, e.target.value)}
                        required={required}
                        min={validation?.min}
                        max={validation?.max}
                        pattern={validation?.regex}
                        className={baseInputClasses}
                    />
                );

            case FIELD_TYPES.TEXTAREA:
                return (
                    <textarea
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(name, e.target.value)}
                        required={required}
                        rows={4}
                        className={baseInputClasses}
                    />
                );

            case FIELD_TYPES.CHECKBOX:
                return (
                    <div className="space-y-2">
                        {options && options.length > 0 ? (
                            options.map((option, idx) => (
                                <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={name}
                                        value={option.value}
                                        checked={Array.isArray(value) ? value.includes(option.value) : false}
                                        onChange={(e) => {
                                            const currentValue = Array.isArray(value) ? value : [];
                                            const newValue = e.target.checked
                                                ? [...currentValue, option.value]
                                                : currentValue.filter(v => v !== option.value);
                                            onChange(name, newValue);
                                        }}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">{option.label}</span>
                                </label>
                            ))
                        ) : (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name={name}
                                    checked={!!value}
                                    onChange={(e) => onChange(name, e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-gray-700">{label}</span>
                            </label>
                        )}
                    </div>
                );

            case FIELD_TYPES.RADIO:
                return (
                    <div className="space-y-2">
                        {options && options.map((option, idx) => (
                            <div key={idx}>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={name}
                                        value={option.value}
                                        checked={value === option.value}
                                        onChange={(e) => onChange(name, e.target.value)}
                                        required={required}
                                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">{option.label}</span>
                                </label>

                                {/* Render nested fields if this option is selected */}
                                {value === option.value && option.nestedFields && option.nestedFields.length > 0 && (
                                    <div className="ml-6 mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-slide-down">
                                        {option.nestedFields.map((nestedField, nIdx) => (
                                            <FormField
                                                key={nIdx}
                                                field={nestedField}
                                                value={nestedFieldValues[`${name}_${nestedField.name}`]}
                                                onChange={(nestedName, nestedValue) => {
                                                    if (onNestedFieldChange) {
                                                        onNestedFieldChange(`${name}_${nestedName}`, nestedValue);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case FIELD_TYPES.SELECT:
                return (
                    <>
                        <select
                            name={name}
                            value={value || ''}
                            onChange={(e) => onChange(name, e.target.value)}
                            required={required}
                            className={baseInputClasses}
                        >
                            <option value="">Select an option...</option>
                            {options && options.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Render nested fields if option is selected */}
                        {value && options && options.find(opt => opt.value === value)?.nestedFields?.length > 0 && (
                            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-slide-down">
                                {options.find(opt => opt.value === value).nestedFields.map((nestedField, nIdx) => (
                                    <FormField
                                        key={nIdx}
                                        field={nestedField}
                                        value={nestedFieldValues[`${name}_${nestedField.name}`]}
                                        onChange={(nestedName, nestedValue) => {
                                            if (onNestedFieldChange) {
                                                onNestedFieldChange(`${name}_${nestedName}`, nestedValue);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mb-5">
            {type !== FIELD_TYPES.CHECKBOX && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {renderField()}
            {error && (
                <p className="mt-1.5 text-sm text-red-600 animate-slide-down">{error}</p>
            )}
        </div>
    );
};

FormField.propTypes = {
    field: PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        required: PropTypes.bool,
        options: PropTypes.array,
        validation: PropTypes.object,
    }).isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    onNestedFieldChange: PropTypes.func,
    nestedFieldValues: PropTypes.object,
};

export default FormField;
