// validators/liveValidator.js
const { z } = require('zod');

const liveSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    url: z.string().min(1, { message: 'URL is required.' }),
});

module.exports = liveSchema;
