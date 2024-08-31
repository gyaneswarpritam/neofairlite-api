// validators/eventValidator.js
const { z } = require('zod');

const eventSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    status: z.string().min(1, { message: 'Status is required.' }),
    startDateTime: z.string().min(1, { message: 'Start Date Time is required.' }),
    endDateTime: z.string().min(1, { message: 'End Date Time is required.' }),
});

module.exports = eventSchema;
