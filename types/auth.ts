export interface School {
  name: string;
  type: string;
  board: string;
  city: string;
  state: string;
  website?: string;
  udiseNumber: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  school: School;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      isVerified: boolean;
    };
    auth: {
      role: "ADMIN" | "TEACHER" | "STUDENT";
      schoolId: string;
    };
  };
}

export interface ResendOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface VerifyOtpPayload {
  email: string;
}
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    auth: {
      role: "ADMIN" | "TEACHER" | "STUDENT";
      schoolId: string;
    };
  };
}
