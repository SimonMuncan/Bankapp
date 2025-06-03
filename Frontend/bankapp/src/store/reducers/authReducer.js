import { jwtDecode } from 'jwt-decode';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    CLEAR_AUTH_ERROR,
    UPDATE_USER_PROFILE_SUCCESS,
} from '../actions/authActionTypes';

let initialUser = null;
const token = localStorage.getItem('authToken');

if (token) {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
            initialUser = {
                id: decodedToken.id,
                name: decodedToken.sub, 
                email: decodedToken.email,
            };
        } else {
            localStorage.removeItem('authToken');
        }
    } catch (e) {
        console.error("Failed to decode token on initial load or token expired:", e);
        localStorage.removeItem('authToken'); 

    }
}

const initialState = {
    isAuthenticated: !!(token && initialUser), 
    user: initialUser,
    token: (token && initialUser) ? token : null, 
    loading: false,
    error: null,
};


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user, 
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case LOGIN_FAILURE:
            localStorage.removeItem('authToken'); 
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        case CLEAR_AUTH_ERROR:
            return {
                ...state,
                error: null,
            };
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                user: {
                ...state.user, 
                ...action.payload, 
                },
            };
        default:
            return state;
    }
};

export default authReducer;