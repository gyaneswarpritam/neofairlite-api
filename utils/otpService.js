const axios = require('axios');

// Function to send OTP via SMS
const sendOtp = async (phone, otp) => {
    // const message = `Dear User, Thank you for registering with us. Your OTP is ${otp} CBP TECHNOLOGIES`;
    // const messageOTP = `Your OTP is ${otp} CBP TECHNOLOGIES`;
    const API_URL = `http://sms.creativepoint.in/api/push.json?apikey=66d1ac73e4baf&route=transsms&sender=CBPTEC&mobileno=${phone}&text=Dear%20Exhibitor,%20a%20visitor%20has%20started%20a%20one-on-one%20VIDEO%20CHAT%20with%20you.%0AYour%20OTP%20%20${otp}%C2%A0CBP%20TECHNOLOGIES`;
    // const API_URL = `http://sms.creativepoint.in/api/push.json?apikey=66d1ac73e4baf&route=transsms&sender=CBPTEC&mobileno=${phone}&text=${message}`
    try {
        return await axios.get(API_URL);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};

module.exports = sendOtp;
