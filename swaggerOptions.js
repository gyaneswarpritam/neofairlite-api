// swaggerOptions.js
module.exports = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your application',
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            },
            {
                url: 'http://100.28.3.126:5001',
                description: 'Prod server'
            }
            // Add more servers if needed
        ],
    },
    apis: ['./routes/*.js', './apiDocs.js'],
};
