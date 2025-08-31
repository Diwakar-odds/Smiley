// State and action types for LoginRegister
export interface AuthState {
  isLogin: boolean;
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  otp: string;
  address: string;
  dateOfBirth: string;
  otpSent: boolean;
}

export interface AuthAction {
  type: string;
  field?: string;
  payload?: any;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
