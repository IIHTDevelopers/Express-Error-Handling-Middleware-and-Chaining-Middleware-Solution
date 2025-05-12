// app.js
const express = require('express');
const app = express();

// Middleware 1: Request Logging Middleware
function requestLogger(req, res, next) {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
}

// Middleware 2: Request Validation Middleware
function validateRequest(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
        // If required fields are missing, throw a validation error
        const error = new Error('Name and email are required');
        error.status = 400;
        return next(error);
    }
    next(); // Pass control to the next middleware
}

// Middleware 3: Simulate a Processing Middleware
function processRequest(req, res, next) {
    try {
        const { name, email } = req.body;
        if (name === 'error') {
            // Simulate an internal server error for a specific name value
            throw new Error('Simulated server error');
        }
        req.processedData = { name, email }; // Attach processed data to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        next(error); // Pass any error to the error-handling middleware
    }
}

// Route for POST request: Process incoming data
app.post('/submit', express.json(), requestLogger, validateRequest, processRequest, (req, res) => {
    // Final route handler that sends a response
    res.status(200).json({
        message: 'Request processed successfully',
        data: req.processedData
    });
});

// Error handling middleware (for catching validation or internal errors)
app.use((err, req, res, next) => {
    if (err.status === 400) {
        return res.status(400).json({ error: err.message }); // Validation error
    }
    // If it's a server error, respond with 500 status
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
