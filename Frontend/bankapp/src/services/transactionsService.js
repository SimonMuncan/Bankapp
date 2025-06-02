import axios from './api'; 

export const getTransactions = async (query, userId, limit, offset) => {
    try {
        const response = await axios.get(`/transactions/${userId}?query=${query}&limit=${limit}&offset=${offset}`);
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

export const getTransactionsPDF = async (query, userId) => {
  try {
    const params = {
      query: query || "", 
    };
    const response = await axios.get(`/transactions/${userId}/export/pdf`, { 
      params: params,
      responseType: 'blob', 
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching PDF transactions:', error.response || error.message);
    throw error; 
  }
};
