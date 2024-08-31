// validators/exhibitorValidator.js
const { z } = require('zod');

const exhibitorSchema = z.object({
    name: z.string().min(1, { message: 'name is required.' }),
    email: z.string().min(1, { message: 'email is required.' }).email('Invalid email address.'),
    companyName: z.string().min(1, { message: 'companyName is required.' }),
    companyAddress: z.string().min(1, { message: 'companyAddress is required.' }),
    phone: z.string().min(1, { message: 'phone is required.' }),
    password: z.string().min(1, { message: 'password is required.' }),
});

const exhibitorLoginSchema = z.object({
    email: z.string().min(1, { message: 'email is required.' }).email('Invalid email address.'),
    password: z.string().min(1, { message: 'Password is required.' })
});

module.exports = { exhibitorSchema, exhibitorLoginSchema };
