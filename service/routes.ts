// API Configuration
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

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
