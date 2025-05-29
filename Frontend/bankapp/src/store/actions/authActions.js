import { jwtDecode } from 'jwt-decode'; 
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    CLEAR_AUTH_ERROR,
} from './authActionTypes';


export const loginRequest = () => ({
    type: LOGIN_REQUEST,
});

export const loginSuccess = (token) => {

    const decodedToken = jwtDecode(token);
    const user = {
        id: decodedToken.id,
        name: decodedToken.sub, 
        email: decodedToken.email,
    };
    localStorage.setItem('authToken', token); 
    return {
        type: LOGIN_SUCCESS,
        payload: { user, token },
    };
};

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});


export const logout = () => {
    localStorage.removeItem('authToken'); 
    return {
        type: LOGOUT,
    };
};

export const clearAuthError = () => ({
    type: CLEAR_AUTH_ERROR,
});

