const axios = require('axios');

// Function to send OTP via SMS
const sendOtp = async (phone, otp) => {
    const API_URL = "https://phpsendsms.herokuapp.com/api/sendsms"; //process.env.SMS_API_URL;
    const message = `Your OTP is ${otp}`;

    try {
        const response = await axios.post(API_URL, { phone: phone, message: message });

        // Assuming the API response has a success status or code to indicate success
        if (response.data && response.data.success) {
            console.log('SMS sent successfully:', response.data);
            return { success: true, message: "OTP sent successfully" };
        } else {
            console.error("Failed to send OTP:", response.data);
            return { success: false, message: "Failed to send OTP" };
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, message: error.message };
    }
};

module.exports = sendOtp;
