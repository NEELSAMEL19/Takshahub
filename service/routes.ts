// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://sample-shui.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    VERIFY_OTP: "/api/auth/verify-otp",
    RESEND_OTP: "/api/auth/resend-otp",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
};
