// validators/stallValidator.js
const { z } = require('zod');

const stallSchema = z.object({
    exhibitor: z.string().min(1, { message: 'Exhibitor ID is required.' }),
});

module.exports = stallSchema;
