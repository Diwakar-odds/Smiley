// frontend/src/components/LoginRegister.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✨ For animations
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";


const LoginRegister = () => {
    const [showReset, setShowReset] = React.useState(false);
    const [resetStep, setResetStep] = React.useState(1);
    const [resetEmail, setResetEmail] = React.useState("");
    const [resetMobile, setResetMobile] = React.useState("");
    const [resetToken, setResetToken] = React.useState("");
    const [resetNewPassword, setResetNewPassword] = React.useState("");
    const [resetMsg, setResetMsg] = React.useState("");

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetMsg("");
        const res = await fetch("http://localhost:5000/api/auth/request-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: resetEmail, mobile: resetMobile })
        });
        const data = await res.json();
        if (res.ok) {
            setResetStep(2);
            setResetMsg("Token sent! Check your email or SMS.");
        } else {
            setResetMsg(data.message || "Error requesting reset");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetMsg("");
        const res = await fetch("http://localhost:5000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: resetEmail, mobile: resetMobile, resetToken, newPassword: resetNewPassword })
        });
        const data = await res.json();
        if (res.ok) {
            setResetMsg("Password reset successful! You can now login.");
            setTimeout(() => { setShowReset(false); setResetStep(1); }, 2000);
        } else {
            setResetMsg(data.message || "Error resetting password");
        }
    };
    const { state, dispatch, sendOtp, handleSubmit } = useAuth();
    const { isLogin, loginType, authMethod, name, mobile, email, password, otp, message, otpSent, sendingOtp, loading } = state;
    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent) => {
        const result = await handleSubmit(e);
        if (result) {
            navigate(result);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-orange-50 to-coffee-100 relative font-sans">
            <AnimatePresence>
                {showReset && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
                        >
                            <button type="button" aria-label="Close" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onClick={() => setShowReset(false)}>&times;</button>
                            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                            {resetStep === 1 ? (
                                <form onSubmit={handleRequestReset} className="space-y-4">
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Email (or leave blank)</label>
                                    <input id="resetEmail" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="w-full px-4 py-2 border rounded" />
                                    <label htmlFor="resetMobile" className="block text-sm font-medium text-gray-700">Mobile (or leave blank)</label>
                                    <input id="resetMobile" type="tel" value={resetMobile} onChange={e => setResetMobile(e.target.value)} className="w-full px-4 py-2 border rounded" />
                                    <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded">Request Reset</button>
                                    {resetMsg && <div className="text-center text-red-500">{resetMsg}</div>}
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700">Reset Token</label>
                                    <input id="resetToken" type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} className="w-full px-4 py-2 border rounded" />
                                    <label htmlFor="resetNewPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input id="resetNewPassword" type="password" value={resetNewPassword} onChange={e => setResetNewPassword(e.target.value)} className="w-full px-4 py-2 border rounded" />
                                    <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded">Reset Password</button>
                                    {resetMsg && <div className="text-center text-green-600">{resetMsg}</div>}
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Floating food-themed blobs */}
            <motion.img
                src="https://www.svgrepo.com/show/353655/burger.svg"
                alt="Burger Icon Background"
                className="absolute top-4 left-4 w-32 h-32 opacity-30 pointer-events-none"
                initial={{ scale: 0.9, rotate: -10 }}
                animate={{ scale: [0.9, 1.05, 0.9], rotate: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.img
                src="https://www.svgrepo.com/show/520564/ice-cream.svg"
                alt="Ice Cream Icon Background"
                className="absolute bottom-4 right-4 w-40 h-40 opacity-30 pointer-events-none"
                initial={{ scale: 0.9, rotate: 10 }}
                animate={{ scale: [0.9, 1.05, 0.9], rotate: [10, -10, 10] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            {/* Glassmorphism Card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
                {/* Left side: pastry/coffee shop vibe */}
                <div className="w-1/2 hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-yellow-50 via-orange-100 to-coffee-200 relative">
                    <div className="flex flex-col items-center justify-center">
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: [0.95, 1.05, 0.95] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            src="https://images.unsplash.com/photo-1565958011703-44e6f8a52b5?auto=format&fit=crop&w=400&q=80"
                            alt="Smiley Softy Register Illustration"
                            className="w-44 h-44 object-cover rounded-full mb-6 shadow-lg border-4 border-yellow-200"
                        />
                        {/* No text inside the image circle */}
                    </div>
                    <h2 className="font-extrabold text-3xl mb-2 text-coffee-900 text-center">Welcome Foodie! 🍔🥤</h2>
                    <p className="text-coffee-700 mb-6 text-center">Register to enjoy exclusive deals on Softy, Patties & Shakes!</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-500 transition"
                        onClick={() => dispatch({ type: 'SET_FIELD', field: 'isLogin', payload: false })}
                    >
                        SIGN UP
                    </motion.button>
                </div>
                {/* Right side: login with blurred pastry bg */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-10 relative">
                    <motion.img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                        alt="Pastry Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-lg rounded-2xl z-0"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: [1.05, 1, 1.05] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                        <h2 className="font-bold text-3xl mb-6 text-center text-coffee-900">
                            {isLogin ? "Login to Continue" : "Create Your Account"}
                        </h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <label htmlFor="regName" className="block text-sm font-medium text-gray-700">Name (required)</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        id="regName"
                                        type="text"
                                        value={name}
                                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', payload: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                        required
                                    />
                                    <label htmlFor="regMobile" className="block text-sm font-medium text-gray-700">Mobile Number (required)</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        id="regMobile"
                                        type="tel"
                                        value={mobile}
                                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'mobile', payload: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                        required
                                    />
                                    <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700">Email (optional)</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        id="regEmail"
                                        type="email"
                                        value={email}
                                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', payload: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                    />
                                    <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        id="regPassword"
                                        type="password"
                                        value={password}
                                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', payload: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                        required
                                    />
                                </>
                            )}
                            {isLogin && (
                                <>
                                    <label htmlFor="loginName" className="block text-sm font-medium text-gray-700">Name (required)</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        id="loginName"
                                        type="text"
                                        value={name}
                                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', payload: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                        required
                                    />
                                    <div className="flex gap-2 mb-2">
                                        <button type="button" className={`px-3 py-1 rounded-full font-semibold border ${loginType === 'mobile' ? 'bg-yellow-400 text-white' : 'bg-white text-coffee-700'}`} onClick={() => dispatch({ type: 'SET_FIELD', field: 'loginType', payload: 'mobile' })}>Mobile</button>
                                        <button type="button" className={`px-3 py-1 rounded-full font-semibold border ${loginType === 'email' ? 'bg-yellow-400 text-white' : 'bg-white text-coffee-700'}`} onClick={() => dispatch({ type: 'SET_FIELD', field: 'loginType', payload: 'email' })}>Email</button>
                                        <button type="button" className={`px-3 py-1 rounded-full font-semibold border ${loginType === 'gmail' ? 'bg-yellow-400 text-white' : 'bg-white text-coffee-700'}`} onClick={() => dispatch({ type: 'SET_FIELD', field: 'loginType', payload: 'gmail' })}>Gmail</button>
                                    </div>
                                    {loginType === 'mobile' && (
                                        <>
                                            <label htmlFor="loginMobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                            <div className="flex gap-2 items-center mb-2">
                                                <motion.input
                                                    whileFocus={{ scale: 1.02 }}
                                                    id="loginMobile"
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'mobile', payload: e.target.value })}
                                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                                    required
                                                />
                                                {authMethod === 'otp' && (
                                                    <button
                                                        type="button"
                                                        className={`px-3 py-2 rounded-full font-semibold border bg-yellow-400 text-white shadow ${sendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={sendOtp}
                                                        disabled={sendingOtp}
                                                    >
                                                        {sendingOtp ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-2 mb-2">
                                                <button type="button" className={`px-3 py-1 rounded-full font-semibold border ${authMethod === 'password' ? 'bg-yellow-400 text-white' : 'bg-white text-coffee-700'}`} onClick={() => dispatch({ type: 'SET_FIELD', field: 'authMethod', payload: 'password' })}>Password</button>
                                                <button type="button" className={`px-3 py-1 rounded-full font-semibold border ${authMethod === 'otp' ? 'bg-yellow-400 text-white' : 'bg-white text-coffee-700'}`} onClick={() => dispatch({ type: 'SET_FIELD', field: 'authMethod', payload: 'otp' })}>OTP</button>
                                            </div>
                                            {authMethod === 'password' && (
                                                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                            )}
                                            {authMethod === 'password' && (
                                                <motion.input
                                                    whileFocus={{ scale: 1.02 }}
                                                    id="loginPassword"
                                                    type="password"
                                                    value={password}
                                                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', payload: e.target.value })}
                                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                                    required
                                                />
                                            )}
                                            {authMethod === 'otp' && (
                                                <label htmlFor="loginOtp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                                            )}
                                            {authMethod === 'otp' && (
                                                <motion.input
                                                    whileFocus={{ scale: 1.02 }}
                                                    id="loginOtp"
                                                    type="text"
                                                    value={otp}
                                                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'otp', payload: e.target.value })}
                                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                                    required
                                                />
                                            )}
                                        </>
                                    )}
                                    {(loginType === 'email' || loginType === 'gmail') && (
                                        <>
                                            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">{loginType === 'gmail' ? 'Gmail Address' : 'Email Address'}</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                id="loginEmail"
                                                type="email"
                                                value={email}
                                                onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', payload: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                                required
                                            />
                                            <label htmlFor="loginEmailPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                id="loginEmailPassword"
                                                type="password"
                                                value={password}
                                                onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', payload: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80 shadow"
                                                required
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className={`w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition shadow ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                                        Loading...
                                    </span>
                                ) : (isLogin ? "LOGIN" : "REGISTER")}
                            </motion.button>
                        </form>
                        {/* Social login */}
                        <div className="mt-6 flex flex-col items-center">
                            <span className="text-coffee-500">Or Sign in with</span>
                            <div className="mt-3 flex items-center justify-center gap-4">
                                <a href="#" title="Sign in with Google" className="bg-white hover:bg-gray-100 rounded-full p-3 shadow flex items-center justify-center">
                                    <span className="sr-only">Sign in with Google</span>
                                    <FcGoogle size={24} />
                                </a>
                                <a href="#" title="Sign in with Facebook" className="bg-blue-700 hover:bg-blue-800 text-white rounded-full p-3 shadow flex items-center justify-center">
                                    <span className="sr-only">Sign in with Facebook</span>
                                    <FaFacebookF size={20} />
                                </a>
                                <a href="#" title="Sign in with LinkedIn" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow flex items-center justify-center">
                                    <span className="sr-only">Sign in with LinkedIn</span>
                                    <FaLinkedinIn size={20} />
                                </a>
                                <a href="#" title="Sign in with Twitter" className="bg-sky-400 hover:bg-sky-500 text-white rounded-full p-3 shadow flex items-center justify-center">
                                    <span className="sr-only">Sign in with Twitter</span>
                                    <FaTwitter size={20} />
                                </a>
                            </div>
                        </div>
                        {/* Switch login/register */}
                        <button
                            type="button"
                            className="mt-6 text-yellow-700 underline"
                            onClick={() => dispatch({ type: 'SET_FIELD', field: 'isLogin', payload: !isLogin })}
                        >
                            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                        </button>
                        {isLogin && (
                            <button
                                type="button"
                                className="mt-2 text-blue-700 underline"
                                onClick={() => setShowReset(true)}
                            >
                                Forgot Password?
                            </button>
                        )}
                        {/* Messages */}
                        {message && <div className="mt-4 text-center text-red-500">{message}</div>}
                        {/* Hide JWT token from UI */}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginRegister;
