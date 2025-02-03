const express = require('express');
const { 
    getAllInvoices, 
    getInvoiceDetails, 
    triggerZapierForOverdueInvoice, 
    createInvoice, 
    deleteInvoice 
} = require('../controller/invoicecontroller');

const invoice_router = express.Router();


invoice_router.get('/getinvoices', getAllInvoices);


invoice_router.get('/getinvoices/:id', getInvoiceDetails);


invoice_router.post('/triggerZapier/:id', triggerZapierForOverdueInvoice);

invoice_router.post('/addinvoices', createInvoice);

//invoice_router.delete('/deleteinvoices/:id', deleteInvoice);

module.exports = invoice_router;
