// validators/brochureValidator.js
const { z } = require('zod');

const brochureSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    media: z.string().min(1, { message: 'Media is required.' }),
    url: z.string().min(1, { message: 'URL is required.' }),
});

module.exports = brochureSchema;
