import api from './../services/api';

export const registerService = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData); 
        return response.data;
    } catch (error) {
        if (error.response){
            throw new Error(error.response.data.detail || `Server error: ${error.response.status}`);
        } else if (error.request){
            throw new Error("No response from server. Please check you network connection.");
        } else {
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
}