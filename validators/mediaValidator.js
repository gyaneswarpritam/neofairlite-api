// validators/mediaValidator.js
const { z } = require('zod');

const mediaSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    media: z.string().min(1, { message: 'Media is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
});

module.exports = mediaSchema;
