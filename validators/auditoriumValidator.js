// validators/auditoriumValidator.js
const { z } = require('zod');

const auditoriumSchema = z.object({
    url: z.string().min(1, { message: 'URL is required.' }),
});

module.exports = auditoriumSchema;
