// validators/activityValidator.js
const { z } = require('zod');

const locationChargesSchema = z.object({
    location: z.string().min(1, { message: 'Location is required.' }),
    price: z.string().min(1, { message: 'Price is required.' }),
    currency: z.string().min(1, { message: 'currency is required.' }),
});

module.exports = locationChargesSchema;
