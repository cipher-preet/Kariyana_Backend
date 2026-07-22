const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
};

const BLACKSMS_API_URL = process.env.BLACKSMS_API_URL || "https://blacksms.in/sms";

export const sendBlackSmsOtp = async (phone: number, otp: number) => {
  const response = await fetch(BLACKSMS_API_URL, {
    method: "POST",
    headers: {
      Authorization: getRequiredEnv("BLACKSMS_API_KEY"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: getRequiredEnv("BLACKSMS_SENDER_ID"),
      variables_values: String(otp),
      numbers: String(phone),
      route: Number(process.env.BLACKSMS_ROUTE || 1),
    }),
  });

  const responseText = await response.text();
  let responseData: any = null;

  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseData = null;
  }

  if (!response.ok || responseData?.status === 0) {
    throw new Error(
      responseData?.message || responseText || "Unable to send OTP",
    );
  }

  return responseData || responseText;
};

