import React, { useReducer, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { AuthState, AuthAction, ToastState } from "./types";
import "./LoginRegister.css";

const initialState: AuthState = {
  isLogin: true,
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  otp: "",
  address: "",
  dateOfBirth: "",
  otpSent: false,
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_FIELD":
      return action.field ? { ...state, [action.field]: action.payload } : state;
    case "TOGGLE_FORM":
      return { ...state, isLogin: !state.isLogin, name: "", email: "", mobile: "", password: "", confirmPassword: "", otp: "", address: "", dateOfBirth: "" };
    default:
      return state;
  }
}

interface StrengthIndicatorProps {
  password: string;
}

const StrengthIndicator: React.FC<StrengthIndicatorProps> = ({ password }) => {
  const getStrength = (): number => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const color = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
  const label = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`strength-indicator-bar ${color[strength - 1] || ''} ${strength ? `strength-level-${strength}` : 'strength-level-0'}`}
        ></div>
      </div>
      <span className="text-xs text-gray-500 w-20 text-right">{label[strength - 1] || ''}</span>
    </div>
  );
};


interface LoginFormProps {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
  handleLogin: () => Promise<void>;
  loading: boolean;
  sendOtp: () => Promise<void>;
  sendingOtp: boolean;
  otpSent?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ dispatch, state, handleLogin, loading, sendOtp, sendingOtp, otpSent }) => {
  const { mobile, otp } = state;

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-10"
    >
      <h2 className="font-bold text-3xl mb-4 text-center text-gray-800">Welcome Back</h2>
      <p className="text-center text-gray-500 mb-8">Login with your mobile number</p>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
        <div>
          <label htmlFor="loginMobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <div className="flex items-center gap-2">
            <motion.input whileFocus={{ scale: 1.02 }} id="loginMobile" type="tel" value={mobile} onChange={e => dispatch({ type: 'SET_FIELD', field: 'mobile', payload: e.target.value })} className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Enter mobile number" />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={sendOtp}
              className={`px-3 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-md hover:from-orange-600 hover:to-pink-600 transition ${sendingOtp || (otpSent && !mobile) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={sendingOtp || (!mobile)}
            >
              {sendingOtp ? 'Sending...' : (otpSent ? 'Resend' : 'Send OTP')}
            </motion.button>
          </div>
        </div>
        {otpSent && (
          <div>
            <label htmlFor="loginOtp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <motion.input whileFocus={{ scale: 1.02 }} id="loginOtp" type="text" value={otp} onChange={e => dispatch({ type: 'SET_FIELD', field: 'otp', payload: e.target.value })} className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Enter OTP" />
          </div>
        )}

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-bold shadow-md hover:from-orange-600 hover:to-pink-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </motion.button>
      </form>
    </motion.div>
  );
};

interface RegisterFormProps {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
  handleRegister: () => Promise<void>;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ dispatch, state, handleRegister, loading }) => {
  const { name, email, mobile, password, confirmPassword, address, dateOfBirth } = state;

  const requiredFilled = name && email && mobile && password && confirmPassword;
  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-10 overflow-y-auto h-full py-8"
    >
      <h2 className="font-bold text-3xl mb-4 text-center text-gray-800">Create Account</h2>
      <p className="text-center text-gray-500 mb-4">Get started with your new account</p>
      <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-2">
        <div>
          <label htmlFor="regName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regName" type="text" value={name} onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Full Name" />
        </div>

        <div>
          <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regEmail" type="email" value={email} onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Email Address" />
        </div>

        <div>
          <label htmlFor="regMobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regMobile" type="tel" value={mobile} onChange={e => dispatch({ type: 'SET_FIELD', field: 'mobile', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Mobile Number" />
        </div>

        <div>
          <label htmlFor="regAddress" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regAddress" type="text" value={address} onChange={e => dispatch({ type: 'SET_FIELD', field: 'address', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" placeholder="Address (Optional)" />
        </div>

        <div>
          <label htmlFor="regDob" className="block text-sm font-medium text-gray-700">Date of Birth (Optional)</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regDob" type="date" value={dateOfBirth} onChange={e => dispatch({ type: 'SET_FIELD', field: 'dateOfBirth', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" placeholder="Date of Birth (Optional)" />
        </div>

        <div>
          <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700">Password</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="regPassword" type="password" value={password} onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Password" />
          <StrengthIndicator password={password} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <motion.input whileFocus={{ scale: 1.02 }} id="confirmPassword" type="password" value={confirmPassword} onChange={e => dispatch({ type: 'SET_FIELD', field: 'confirmPassword', payload: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/95 text-black placeholder-gray-400 shadow-sm" required placeholder="Confirm Password" />
        </div>
        <motion.button
          whileHover={{ scale: requiredFilled && !loading ? 1.03 : 1 }}
          whileTap={{ scale: requiredFilled && !loading ? 0.97 : 1 }}
          type="submit"
          className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-bold shadow-md hover:from-orange-600 hover:to-pink-600 transition ${(!requiredFilled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!requiredFilled || loading}
        >
          {loading ? 'Registering...' : 'REGISTER'}
        </motion.button>
      </form>
    </motion.div>
  );
};

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.3 }}
    className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
  >
    {message}
  </motion.div>
);

const LoginRegister: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login, register, sendOtp: authSendOtp } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const { isLogin } = state;

  const showToast = (message: string, type: 'success' | 'error'): void => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async (): Promise<void> => {
    if (!state.mobile || !state.otp) {
      showToast("Please enter mobile number and OTP", "error");
      return;
    }
    setLoading(true);
    try {
      const loginPayload = {
        mobile: state.mobile,
        otp: state.otp
      };
      await login(loginPayload);
      showToast("Login successful!", "success");
      // Navigation handled in useAuth based on role
    } catch (error: any) {
      showToast(error.message || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (state.password !== state.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (!state.name || !state.email || !state.mobile || !state.password) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const registerPayload = {
        name: state.name,
        email: state.email,
        mobile: state.mobile,
        password: state.password,
        ...(state.address && { address: state.address }),
        ...(state.dateOfBirth && { dateOfBirth: state.dateOfBirth }),
      };
      await register(registerPayload);
      showToast("Registration successful! Please login.", "success");
      dispatch({ type: 'TOGGLE_FORM' });
    } catch (error: any) {
      showToast(error.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (): Promise<void> => {
    if (!state.mobile) {
      showToast("Please enter your mobile number", "error");
      return;
    }
    setSendingOtp(true);
    setOtpSent(false);
    try {
      await authSendOtp(state.mobile);
      showToast("OTP sent successfully!", "success");
      setOtpSent(true);
    } catch (error: any) {
      showToast(error.message || "Failed to send OTP. Please try again.", "error");
    } finally {
      setSendingOtp(false);
    }
  };

  // Responsive: detect mobile view
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50 font-sans">
        <div className={`relative w-full max-w-sm mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex ${isMobile ? 'flex-col h-auto' : 'h-[650px]'}`}>
          {/* Form Panels */}
          {isMobile ? (
            <>
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: isLogin ? 0 : '-100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isLogin ? 0 : '-100%' }}
                transition={{ duration: 0.5 }}
                className="w-full flex items-center justify-center px-6 py-8 sm:px-10 sm:py-12"
                style={{ minHeight: '400px' }}
              >
                <div className="w-full">
                  {isLogin ? (
                    <LoginForm dispatch={dispatch} state={state} handleLogin={handleLogin} loading={loading} sendOtp={handleSendOtp} sendingOtp={sendingOtp} otpSent={otpSent} />
                  ) : (
                    <RegisterForm dispatch={dispatch} state={state} handleRegister={handleRegister} loading={loading} />
                  )}
                </div>
              </motion.div>
              {/* Overlay Container: show toggle button at bottom */}
              <motion.div
                className="w-full flex flex-col items-center justify-center p-6 bg-gradient-to-t from-yellow-400 to-orange-500 text-white text-center rounded-b-3xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ minHeight: '160px' }}
              >
                <h2 className="font-extrabold text-2xl mb-2 drop-shadow-lg">
                  {isLogin ? "Hello, Friend!" : "Welcome Back!"}
                </h2>
                <p className="mb-4 text-sm opacity-90">
                  {isLogin ? "Enter your personal details and start your journey with us" : "To keep connected with us please login with your personal info"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/80 text-orange-500 px-8 py-3 rounded-full font-bold shadow-md hover:bg-white transition-all duration-200"
                  onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                  style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}
                >
                  {isLogin ? "SIGN UP" : "LOGIN"}
                </motion.button>
              </motion.div>
            </>
          ) : (
            <>
              <div className="w-1/2 h-full flex items-center justify-center">
                <LoginForm dispatch={dispatch} state={state} handleLogin={handleLogin} loading={loading} sendOtp={handleSendOtp} sendingOtp={sendingOtp} otpSent={otpSent} />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <RegisterForm dispatch={dispatch} state={state} handleRegister={handleRegister} loading={loading} />
              </div>
              {/* Overlay Container */}
              <motion.div
                className="absolute top-0 left-0 w-1/2 h-full z-20 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-center"
                animate={{ x: isLogin ? '100%' : '0%' }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <motion.div
                  key={isLogin ? "login" : "register"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="font-extrabold text-3xl mb-2">
                    {isLogin ? "Hello, Friend!" : "Welcome Back!"}
                  </h2>
                  <p className="mb-6">
                    {isLogin ? "Enter your personal details and start your journey with us" : "To keep connected with us please login with your personal info"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-white/30 transition"
                    onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                  >
                    {isLogin ? "SIGN UP" : "LOGIN"}
                  </motion.button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginRegister;
