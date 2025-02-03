const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true, 
    },
    amount: {
        type: Number,
        required: true, 
    },
    dueDate: {
        type: Date,
        required: true, 
    },
    recipientEmail: {
        type: String,
        required: true, 
    },
   /* recipientName: {
        type: String,
        required: true, 
    },*/
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'overdue'],
        default: 'unpaid', 
    },
}, {
    timestamps: true,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
