const axios = require('axios');

// Function to send OTP via SMS
const sendOtp = async (phone, otp) => {
    // const message = `Dear User, Thank you for registering with us. Your OTP is ${otp} CBP TECHNOLOGIES`;
    // const messageOTP = `Your OTP is ${otp} CBP TECHNOLOGIES`;
    // const API_URL = `http://sms.creativepoint.in/api/push.json?apikey=66d1ac73e4baf&route=transsms&sender=CBPTEC&mobileno=${phone}&text=Dear%20Customer,%20Thank%20you%20for%20registering%20with%20us.%20Your%20One-Time%20Password%20(OTP)%20is%20${otp}.%20Regards,%20CBP%20TECHNOLOGIES`;
    const API_URL = `https://whatsappsms.creativepoint.in/api/sendText?token=cm2egr6cg1slzqjxxyc1l7w52&phone=${phone}&message=Dear%20Customer,%20Thank%20you%20for%20registering%20with%20us.%20Your%20One-Time%20Password%20(OTP)%20is%20${otp}.%20Regards,%20CBP%20TECHNOLOGIES`
    try {
        return await axios.get(API_URL);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};
// Function to send OTP via SMS
const sendPhoneMessage = async (phone, message) => {
    const API_URL = `https://whatsappsms.creativepoint.in/api/sendText?token=cm2egr6cg1slzqjxxyc1l7w52&phone=${phone}&message=${message}`
    try {
        return await axios.get(API_URL);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};

module.exports = { sendOtp, sendPhoneMessage };
