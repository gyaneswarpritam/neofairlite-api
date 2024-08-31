// validators/adminValidator.js
const { z } = require('zod');

const adminSchema = z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email('Invalid email address.'),
    password: z.string().min(1, { message: 'Password is required.' }),
});

module.exports = adminSchema;
