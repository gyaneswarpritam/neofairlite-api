// validators/activityValidator.js
const { z } = require('zod');

const settingSchema = z.object({
    location: z.string().min(1, { message: 'Location is required.' }),
    country: z.string().min(1, { message: 'Country is required.' }),
    fairName: z.string().min(1, { message: 'Fair Name is required.' }),
    startDateTime: z.string().min(1, { message: 'Start Date & time is required.' }),
    endDateTime: z.string().min(1, { message: 'End Date & time is required.' }),
    timezone: z.string().min(1, { message: 'Timezone is required.' }),
    duration: z.string().min(1, { message: 'Duration is required.' }),
});

module.exports = settingSchema;
