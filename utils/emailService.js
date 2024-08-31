// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configure transporter options
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: 'your-email@example.com',
            to,
            subject,
            text
        });
        console.log('Email sent');
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = { sendEmail };
