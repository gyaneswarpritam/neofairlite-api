// validators/faqValidator.js
const { z } = require('zod');

const flashMessageSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    userType: z.string().min(1, { message: 'User Type is required.' }),
    status: z.string().min(1, { message: 'Status is required.' }),
});

module.exports = flashMessageSchema;
