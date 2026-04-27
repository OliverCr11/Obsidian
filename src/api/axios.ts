import axios from 'axios';

// Get the API URL from environment variables (Vercel/Local)
let rootUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
rootUrl = rootUrl.replace(/\/+$/, ''); // Strip trailing slashes
// Force /api ending if not explicitly provided
const baseURL = rootUrl.endsWith('/api') ? rootUrl : `${rootUrl}/api`;

// Create a centralized Axios instance
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach the token to every request
api.interceptors.request.use((config: any) => {
    let token = null;
    try {
        const authData = localStorage.getItem('obsidian-auth-core');
        if (authData) {
            token = JSON.parse(authData).state?.token;
        }
    } catch (e) {}
    
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global Response Interceptor for 401 Graceful Degradation
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If backend explicitly rejects token, gracefully clear it and retry as Guest
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            
            console.warn('Expired or Invalid Token Detected. Transitioning strictly to Guest Mode.');
            
            // Wipe the persisted Zustand JSON structure completely
            localStorage.removeItem('obsidian-auth-core');
            localStorage.removeItem('token');
            localStorage.removeItem('access_token');
            
            // Delete the poisoned header
            if (originalRequest.headers) {
                delete originalRequest.headers.Authorization;
            }
            
            // Rerun the original request anonymously so components successfully evaluate the payload
            return api(originalRequest);
        }

        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;