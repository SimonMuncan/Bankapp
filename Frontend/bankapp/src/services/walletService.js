import axios from './api'; 

export const getWalletAndUser = async (userId) => {
    try {
        const response = await axios.get(`/wallet/${userId}`);
        return response.data; 
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || `Server error: ${error.response.status}`);
        } else if (error.request) {
            throw new Error("No response from server. Please check your network connection.");
        } else {
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
};
