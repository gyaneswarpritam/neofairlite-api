// validators/activityValidator.js
const { z } = require('zod');

const activitySchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    startTime: z.string().min(1, { message: 'Start time is required.' }),
    endTime: z.string().min(1, { message: 'End time is required.' }),
});

module.exports = activitySchema;
