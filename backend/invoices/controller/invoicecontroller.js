const { getConnection } = require("../config/db");
const axios = require("axios");
const { ObjectId } =require('mongodb'); 

const getAllInvoices = async (req, res) => {
    try {
        const { db } = await getConnection();
        const invoicesCollection = db.collection("Invoicescollection"); 
        
        const invoices = await invoicesCollection.find({ dueDate: { $lte: new Date() } }).toArray();

        
        if (invoices.length === 0) {
            return res.status(404).json({ message: "No overdue invoices found" });
        }
        res.json(invoices);
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};
const getInvoiceDetails = async (req, res) => {
    try {
        const { db } = await getConnection();
        const invoicesCollection = db.collection("Invoicescollection");

        const { id } = req.params; 

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid invoice ID format" });
        }

        const invoice = await invoicesCollection.findOne({ _id: new ObjectId(id) });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json(invoice);
    } catch (error) {
        console.error("Error fetching invoice details:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};

const createInvoice = async (req, res) => {
    try {
        console.log("Request Body:", req.body);  // Log the request body
        const { db } = await getConnection();
        const invoicesCollection = db.collection("Invoicescollection");

        const newInvoice = {
            invoiceNumber: req.body.invoiceNumber,
            amount: req.body.amount,
            dueDate: new Date(req.body.dueDate),
            recipientEmail: req.body.recipientEmail,
        };

        const result = await invoicesCollection.insertOne(newInvoice);
    
        const createdInvoice = await invoicesCollection.findOne({ _id: result.insertedId });

        res.status(201).json({ message: "Invoice created successfully", invoice: createdInvoice });
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};
const triggerZapierForOverdueInvoice = async (req, res) => {
    try {
        const { db } = await getConnection();
        const invoicesCollection = db.collection("Invoicescollection");

        const { id } = req.params; 

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid invoice ID format" });
        }

        const invoice = await invoicesCollection.findOne({ _id: new ObjectId(id) });

        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const now = new Date();
        if (new Date(invoice.dueDate) >= now) {
            return res.status(400).json({ message: "Invoice is not overdue yet" });
        }

        const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21550331/2fnekdy/";
        await axios.post(ZAPIER_WEBHOOK_URL, {
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            dueDate: invoice.dueDate,
            recipientEmail: invoice.recipientEmail
        });

        res.json({ message: "Zapier webhook triggered for overdue invoice" });
    } catch (error) {
        console.error("Error triggering Zapier webhook:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};

module.exports = { getAllInvoices, getInvoiceDetails, createInvoice, triggerZapierForOverdueInvoice };










/*
const Invoice = require('../model/model'); 
const axios = require('axios');
const { getConnection } =require("../config/db");

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ dueDate: { $lte: new Date() } }); 
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const getInvoiceDetails = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const triggerZapierForOverdueInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const now = new Date();
        if (new Date(invoice.dueDate) >= now) {
            return res.status(400).json({ message: "Invoice is not overdue yet" });
        }

        const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21550331/2fnsd96/";
        await axios.post(ZAPIER_WEBHOOK_URL, {
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            dueDate: invoice.dueDate,
            recipientEmail: invoice.recipientEmail
        });

        res.json({ message: "Zapier webhook triggered for overdue invoice" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const createInvoice = async (req, res) => {
    try {
        const newInvoice = new Invoice({
            invoiceNumber: req.body.invoiceNumber,
            amount: req.body.amount,
            dueDate: req.body.dueDate,
            recipientEmail: req.body.recipientEmail,
           
        });

        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error("Error creating invoice:", error); // Logs the full error in the console
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message || error 
        });
    }
};


const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { 
    getAllInvoices, 
    getInvoiceDetails, 
    triggerZapierForOverdueInvoice, 
    createInvoice, 
    deleteInvoice 
};
*/