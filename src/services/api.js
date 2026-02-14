import axios from 'axios';

// IMPORTANT: Use your computer's IP address here so your phone can reach it.
// Based on current network, your computer IP is: 10.73.70.131
const API_URL = 'http://10.73.70.131:5000/api/auth';

const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            name,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export default {
    register,
    login,
};
