// validators/briefcaseValidator.js
const { z } = require('zod');

const briefcaseSchema = z.object({
    product: z.string().nonempty({ message: 'Product ID is required.' }),
    exhibitor: z.string().nonempty({ message: 'Exhibitor ID is required.' }),
    visitor: z.string().nonempty({ message: 'Visitor ID is required.' }),
    catalog: z.boolean(),
});

module.exports = briefcaseSchema;
