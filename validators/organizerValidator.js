// validators/organizerValidator.js
const { z } = require('zod');

const organizerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().min(1, { message: 'Email is required.' }).email('Invalid email address.'),
    password: z.string().optional(),
    budget: z.string().min(1, { message: 'Budget is required.' }),
    interest: z.string().min(1, { message: 'Interest is required.' }),
    eventType: z.string().min(1, { message: 'Event type is required.' }),
});

module.exports = organizerSchema;
