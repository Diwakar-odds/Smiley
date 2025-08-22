import { useReducer } from 'react';

const API_URL = "http://localhost:5000/api/auth";

type State = {
  isLogin: boolean;
  loginType: 'mobile' | 'email' | 'gmail';
  authMethod: 'password' | 'otp';
  name: string;
  mobile: string;
  email: string;
  password: string;
  otp: string;
  message: string;
  otpSent: boolean;
  sendingOtp: boolean;
  loading: boolean;
};

type Action = 
  | { type: 'SET_FIELD', field: keyof State, payload: State[keyof State] }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_MESSAGE', payload: string }
  | { type: 'SET_OTP_SENT', payload: boolean };

const initialState: State = {
  isLogin: true,
  loginType: 'mobile',
  authMethod: 'password',
  name: '',
  mobile: '',
  email: '',
  password: '',
  otp: '',
  message: '',
  otpSent: false,
  sendingOtp: false,
  loading: false,
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_OTP_SENT':
      return { ...state, otpSent: action.payload };
    default:
      return state;
  }
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const sendOtp = async () => {
    if (!state.mobile.trim()) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Please enter your mobile number first.' });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: '' });
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: state.mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'SET_OTP_SENT', payload: true });
        dispatch({ type: 'SET_MESSAGE', payload: data.message || "OTP sent to your mobile number." });
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: data.message || "Failed to send OTP." });
      }
    // @ts-ignore
    } catch (error) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Network error while sending OTP.' });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_MESSAGE', payload: '' });

    if (!state.isLogin && (!state.name.trim() || !state.mobile.trim())) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Name and mobile number are required for registration.' });
      return;
    }

    if (state.isLogin && !state.name.trim()) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Name is required for login.' });
      return;
    }

    if (state.isLogin) {
      if (state.loginType === "mobile" && !state.mobile.trim()) {
        dispatch({ type: 'SET_MESSAGE', payload: 'Mobile number is required for login.' });
        return;
      }
      if (state.loginType === "email" && !state.email.trim()) {
        dispatch({ type: 'SET_MESSAGE', payload: 'Email is required for login.' });
        return;
      }
      if (state.loginType === "gmail" && !state.email.trim()) {
        dispatch({ type: 'SET_MESSAGE', payload: 'Gmail is required for login.' });
        return;
      }
      if (state.loginType === "mobile" && state.authMethod === "otp" && !state.otp.trim()) {
        dispatch({ type: 'SET_MESSAGE', payload: 'OTP is required for mobile login.' });
        return;
      }
      if (state.loginType === "mobile" && state.authMethod === "password" && !state.password.trim()) {
        dispatch({ type: 'SET_MESSAGE', payload: 'Password is required for mobile login.' });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const endpoint = state.isLogin ? "/login" : "/register";
      let payload;
      if (state.isLogin) {
        if (state.loginType === "mobile") {
          payload = state.authMethod === "otp"
            ? { name: state.name, mobile: state.mobile, otp: state.otp }
            : { name: state.name, mobile: state.mobile, password: state.password };
        } else {
          payload = { name: state.name, email: state.email, password: state.password };
        }
      } else {
        payload = { name: state.name, mobile: state.mobile, email: state.email, password: state.password };
      }
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (state.isLogin && data.token) {
          localStorage.setItem("jwtToken", data.token);
          localStorage.setItem("username", state.name);
          dispatch({ type: 'SET_MESSAGE', payload: 'Login successful!' });
          return "/"; // Indicate successful login
        } else {
          dispatch({ type: 'SET_MESSAGE', payload: data.message || "Registration successful!" });
        }
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: data.message || "Error" });
      }
    // @ts-ignore
    } catch (error) {
      dispatch({ type: 'SET_MESSAGE', payload: 'Network error' });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
    return null; // Indicate failed login
  };

  return { state, dispatch, sendOtp, handleSubmit };
};