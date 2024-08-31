// validators/faqValidator.js
const { z } = require('zod');

const faqSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
});

module.exports = faqSchema;
