// validators/hallValidator.js
const { z } = require('zod');

const hallSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
});

module.exports = hallSchema;
