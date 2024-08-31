// validators/stallVideoValidator.js
const { z } = require('zod');

const stallVideoSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().optional(),
    url: z.string().optional(),
    exhibitor: z.string().nonempty({ message: 'Exhibitor ID is required.' }),
    active: z.string().default(true),
    deleted: z.string().default(false),
});

module.exports = stallVideoSchema;
