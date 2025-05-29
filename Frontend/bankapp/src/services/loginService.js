import api from './../services/api';

export const login = async (formData) => {
    try {
        const response = await api.post('/auth/token', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    });
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
