import { Transaction } from '../types';
import axios from './api'; 

export const getTransactions = async (
                                query: string | null,
                                userId: number,
                                limit: number,
                                offset: number,
                                transactionType: string
                            ): Promise<Transaction[]> => {
    try {
        const params = {
            query: query || "",
            limit: limit,
            offset: offset,
            transaction_type: transactionType, 
            };
            const response = await axios.get(`/transactions/${userId}`, { params });
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

export const getTransactionsPDF = async (query, userId, transactionType) => {
  try {
    const params = {
      query: query || "",
      transaction_type: transactionType, 
    };
    const response = await axios.get(`/transactions/export/pdf/${userId}`, { 
      params: params,
      responseType: 'blob', 
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching PDF transactions:', error.response || error.message);
    throw error; 
  }
};
