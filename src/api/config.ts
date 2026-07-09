// Centralized API base URL configuration
// All API calls should use this constant instead of hardcoding '/api'
let _apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://smiley-food-backend.onrender.com/api';
if (_apiBaseUrl && !_apiBaseUrl.endsWith('/api')) {
  _apiBaseUrl = _apiBaseUrl.replace(/\/$/, '') + '/api';
}
export const API_BASE_URL = _apiBaseUrl;
