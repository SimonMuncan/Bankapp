import axios from './api'; 

export const transferMoney = async (senderId, receiverId, amount) => {
    try {
        const response = await axios.patch(`/transactions/transfer-money?sender_user_id=${senderId}&reciever_user_id=${receiverId}&amount=${amount}`);
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
