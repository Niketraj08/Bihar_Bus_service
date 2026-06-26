import twilio from 'twilio';

export const sendOTP = async (phone, otp) => {
  try {
    // For development, you can use Twilio or a mock service
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${phone}: ${otp}`);
      return { success: true, message: 'OTP sent (check console in development)' };
    }

    // Initialize Twilio client only when needed and not in development
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your Bihar Bus Service OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('OTP sending error:', error);
    return { success: false, error: error.message };
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

