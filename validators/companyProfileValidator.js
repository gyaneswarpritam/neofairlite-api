// validators/companyProfileValidator.js
const { z } = require('zod');

const companyProfileSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().optional(),
    fileType: z.enum(['secured', 'downloadable']).optional(),
    file: z.string().optional(),
    exhibitor: z.string().nonempty({ message: 'Exhibitor ID is required.' }),
});

module.exports = companyProfileSchema;
