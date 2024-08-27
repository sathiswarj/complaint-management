const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: {type: String},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdetail',
        required: true
    }

});

module.exports = mongoose.model('Complaint', complaintSchema);
