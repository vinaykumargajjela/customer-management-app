import axios from 'axios';

// Create a pre-configured instance of axios
const apiClient = axios.create({
    // Use the environment variable for the deployed URL, or default to localhost for development
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;