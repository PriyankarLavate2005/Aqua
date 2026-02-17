const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['pump_on', 'pump_off', 'temperature_alert', 'temperature_normal'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        temperature: {
            type: Number,
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
notificationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
