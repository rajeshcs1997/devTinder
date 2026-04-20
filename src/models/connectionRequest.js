const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: { values: ['ignored', 'interested', 'accepted', 'rejected'], message: '{VALUE} is not a valid status' },
        default: 'ignored'
    }
}, { timestamps: true });

connectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;