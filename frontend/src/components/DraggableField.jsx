import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import Button from './Button';

const DraggableField = ({ id, field, index, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move mt-1 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>

                {/* Field Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                                {field.label || 'Untitled Field'}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </h4>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {field.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                    name: {field.name || 'unnamed'}
                                </span>
                            </div>
                            {field.options && field.options.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {field.options.length} option{field.options.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onEdit}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDelete}
                                className="text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

DraggableField.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DraggableField;
