// tests/app.test.js
const request = require('supertest');
const app = require('../app'); // Import the Express app

let appBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {
        it(`${appBoundaryTest} should log the incoming request details`, async () => {
            // Mock console.log to check if the request is logged
            console.log = jest.fn();

            // Send a POST request to /submit route
            await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'john@example.com' });

            // Check if console.log was called with the correct log string
            expect(console.log).toHaveBeenCalledWith('Incoming Request: POST /submit');
        });

        it(`${appBoundaryTest} should return an error if required fields are missing in the request body`, async () => {
            // Send a POST request without "name" and "email"
            const response = await request(app)
                .post('/submit')
                .send({});

            // Validate that the response is a 400 status with an appropriate error message
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Name and email are required');
        });

        it(`${appBoundaryTest} should process valid data and send a successful response`, async () => {
            const requestData = { name: 'John Doe', email: 'john@example.com' };

            // Send a POST request with valid data
            const response = await request(app)
                .post('/submit')
                .send(requestData);

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Request processed successfully');
            expect(response.body.data).toEqual(requestData);
        });

        it(`${appBoundaryTest} should return a 500 error if a simulated server error occurs in processRequest middleware`, async () => {
            // Send a POST request with "name" as 'error' to simulate the server error
            const response = await request(app)
                .post('/submit')
                .send({ name: 'error', email: 'john@example.com' });

            // Validate that a 500 error is returned with the correct error message
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
        });

        it(`${appBoundaryTest} should handle missing parameters and return a 400 error for invalid request data`, async () => {
            // Send a POST request with missing 'email' parameter
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe' });

            // Validate that the response is a 400 status with an appropriate error message
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Name and email are required');
        });
    });
});