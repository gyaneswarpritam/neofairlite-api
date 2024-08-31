// validators/visualValidator.js
const { z } = require('zod');

const visualSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    type: z.string().min(1, { message: 'Type is required.' }).refine(value => {
        return ["pdf", "video"].includes(value);
    }, { message: 'Invalid type. Must be "pdf" or "video".' }),
});

module.exports = visualSchema;
