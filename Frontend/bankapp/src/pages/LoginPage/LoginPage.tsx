import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './LoginPage.module.css';
import { login } from '../../services/loginService';

import {
    loginRequest,
    loginSuccess,
    loginFailure,
    clearAuthError
} from '../../store/actions/authActions';
import InputLogin from '../../components/InputLogin.tsx';
import { RootState } from '../../types';

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error: reduxError, isAuthenticated } = useSelector((state: RootState) => state.auth);


    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(clearAuthError());
        dispatch(loginRequest());

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await login(formData);
            dispatch(loginSuccess(response.access_token));

        } catch (err) {
            let errorMessage = 'Login request failed. Please try again later.';
            if (err.response && err.response && err.response.detail) {
                errorMessage = err.response.detail;
            } else if (err.request) {
                errorMessage = 'No response from server. Please check your network connection.';
            }
            dispatch(loginFailure(errorMessage));
            console.error('Login error:', err);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authFormCard}>
                <h2 className={styles.authTitle}>Login</h2>
                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {reduxError && <p className={styles.errorMessage}>{reduxError}</p>}
                    <div className={styles.formGroup}>
                        <InputLogin id="email" type="email" value={email} set={setEmail} title="Email" placeHolder="you@example.com" isLoading={loading} dispatch={dispatch} reduxError={reduxError} clearAuthError={clearAuthError}/>
                    </div>
                    <div className={styles.formGroup}>
                        <InputLogin id="password" type="password" value={password} set={setPassword} title="Password" placeHolder="••••••••" isLoading={loading} dispatch={dispatch} reduxError={reduxError} clearAuthError={clearAuthError}/>
                    </div>
                    <button type="submit" className={styles.authButton} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className={styles.authRedirectText}>
                    Don't have an account? <Link to="/register" className={styles.authLink}>Register here</Link>
                </p>
                <p className={styles.authRedirectText}>
                    <Link to="/forgot-password" className={styles.authLink}>Forgot password?</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;