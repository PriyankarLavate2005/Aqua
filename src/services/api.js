import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Use your computer's IP address here so your phone can reach it.
// Based on current network, your computer IP is: 192.168.175.131
const API_URL = 'http://192.168.175.131:5000/api/auth';
const NOTIFICATION_URL = 'http://192.168.175.131:5000/api/notifications';

// Helper function to get auth token
const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

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

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to send OTP';
    }
};

const verifyOTP = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Verification failed';
    }
};

// Notification API functions
const getNotifications = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(NOTIFICATION_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch notifications';
    }
};

const markAsRead = async (notificationId) => {
    try {
        const token = await getAuthToken();
        const response = await axios.put(
            `${NOTIFICATION_URL}/${notificationId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to mark as read';
    }
};

const markAllAsRead = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.put(
            `${NOTIFICATION_URL}/read-all`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to mark all as read';
    }
};

const createNotification = async (type, title, message, temperature = null) => {
    try {
        const token = await getAuthToken();
        const response = await axios.post(
            NOTIFICATION_URL,
            { type, title, message, temperature },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create notification';
    }
};

const clearAllNotifications = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.delete(NOTIFICATION_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to clear notifications';
    }
};

export {
    register,
    login,
    forgotPassword,
    verifyOTP,
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    clearAllNotifications,
};

export default {
    register,
    login,
    forgotPassword,
    verifyOTP,
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    clearAllNotifications,
};
