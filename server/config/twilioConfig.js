// Configuration for Twilio SMS service
export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || "your_account_sid",
  authToken: process.env.TWILIO_AUTH_TOKEN || "your_auth_token",
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || "your_twilio_phone_number",
  verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || "",
};

// Add any other Twilio-related configuration options here
