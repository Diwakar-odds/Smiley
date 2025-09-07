import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

interface UseSessionTimeoutProps {
  timeout?: number; // in milliseconds
  warningTime?: number; // time before timeout to show warning
  onWarning?: () => void;
  onTimeout?: () => void;
}

export const useSessionTimeout = ({
  timeout = 30 * 60 * 1000, // 30 minutes default
  warningTime = 5 * 60 * 1000, // 5 minutes warning default
  onWarning,
  onTimeout
}: UseSessionTimeoutProps = {}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    showToast('info', 'Session expired. Please log in again.');
    navigate('/login');
    onTimeout?.();
  }, [navigate, showToast, onTimeout]);

  const showWarning = useCallback(() => {
    showToast('info', `Your session will expire in ${Math.ceil(warningTime / 60000)} minutes. Please refresh the page to extend your session.`, 10000);
    onWarning?.();
  }, [showToast, warningTime, onWarning]);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    lastActivityRef.current = Date.now();

    // Set warning timer
    warningRef.current = setTimeout(showWarning, timeout - warningTime);

    // Set logout timer
    timeoutRef.current = setTimeout(logout, timeout);
  }, [timeout, warningTime, showWarning, logout]);

  const handleActivity = useCallback(() => {
    // Only reset if enough time has passed to avoid excessive resets
    const now = Date.now();
    if (now - lastActivityRef.current > 60000) { // 1 minute throttle
      resetTimer();
    }
  }, [resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
    showToast('success', 'Session extended successfully.');
  }, [resetTimer, showToast]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    // Start the timer
    resetTimer();

    // Activity events to monitor
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [resetTimer, handleActivity]);

  return {
    extendSession,
    resetTimer
  };
};
