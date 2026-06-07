export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isVerified: boolean;
  school: {
    name: string;
    type: string;
    board: string;
    city: string;
    state: string;
    website?: string;
    udiseNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}

export interface OtpPayload {
  email: string;
  otp?: string;
}


