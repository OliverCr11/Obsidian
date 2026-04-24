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

// Optional: Add an interceptor to handle errors globally later
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;