import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000/api/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Logging in with credentials:", credentials);
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.token) {
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("username", data.name); // Updated to match actual structure
        if (data.role === "admin") { // Updated to match actual structure
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Registering user with data:", userData);
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log("Registration response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      return data;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (mobile: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending OTP to mobile:", mobile);
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      console.log("Send OTP response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      return data;
    } catch (err: any) {
      console.error("Send OTP error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return { login, register, logout, sendOtp, loading, error };
};