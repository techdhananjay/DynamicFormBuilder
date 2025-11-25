const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'number', 'email', 'date', 'checkbox', 'radio', 'select']
    },
    required: {
        type: Boolean,
        default: false
    },
    options: [{
        value: String,
        label: String,
        nestedFields: [this] // Recursive schema for nested fields
    }],
    validation: {
        min: Number,
        max: Number,
        regex: String,
        message: String
    },
    order: {
        type: Number,
        required: true
    }
}, { _id: false });

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    fields: [fieldSchema],
    version: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
formSchema.index({ isActive: 1, createdAt: -1 });

// Method to increment version when form is updated
formSchema.methods.incrementVersion = function () {
    this.version += 1;
    return this.save();
};

// Validate unique field names within a form
formSchema.pre('save', function (next) {
    const fieldNames = this.fields.map(f => f.name);
    const uniqueNames = new Set(fieldNames);

    if (fieldNames.length !== uniqueNames.size) {
        return next(new Error('Field names must be unique within a form'));
    }

    next();
});

module.exports = mongoose.model('Form', formSchema);
