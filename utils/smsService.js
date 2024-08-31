// // utils/smsService.js
// const twilio = require('twilio');
// const config = require('../config/config');

// const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

// const sendSMS = async (to, body) => {
//     try {
//         await client.messages.create({
//             body,
//             from: config.twilioPhoneNumber,
//             to
//         });
//         console.log('SMS sent');
//     } catch (error) {
//         console.error('SMS sending failed:', error);
//     }
// };

// module.exports = { sendSMS };
