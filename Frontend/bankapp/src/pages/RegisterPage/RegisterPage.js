import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegistarPage.module.css'; 
import { registerService } from '../../services/registerService';
import InputRegister from "../../components/InputRegister";


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true); 

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false); 
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long!');
            setIsLoading(false); 
            return;
        }

        const userData = {
            name: username, 
            email: email,
            password: password,
        };

        try {
            const response = await registerService(userData); 

            setSuccessMessage(response.detail || 'Registration successful! Please login.');

            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (err) {
            if (err.response && err.response.data && err.response.detail) {
                setError(err.response.detail);
            } else if (err.request) {
                setError('No response from server. Please check your network connection.');
            } else {
                setError('Registration request failed. Please try again.');
            }
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authFormCard}>
                <h2 className={styles.authTitle}>Create Account</h2>
                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    <div className={styles.formGroup}>
                        <InputRegister id="username" type="text" value={username} set={setUsername} title="Username" placeHolder="Choose a username" isLoading={isLoading}/>
                    </div>
                    <div className={styles.formGroup}>
                        <InputRegister id="email" type="email" value={email} set={setEmail} title="Email Address" placeHolder="you@example.com" isLoading={isLoading}/>
                    </div>
                    <div className={styles.formGroup}>
                        <InputRegister id="password" type="password" value={password} set={setPassword} title="Password" placeHolder="Create a strong password" isLoading={isLoading}/>
                    </div>
                    <div className={styles.formGroup}>
                        <InputRegister id="confirmPassword" type="password" value={confirmPassword} set={setConfirmPassword} title="Confirm Password" placeHolder="Repeat your password" isLoading={isLoading}/>
                    </div>
                    <button type="submit" className={styles.authButton} disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className={styles.authRedirectText}>
                    Already have an account? <Link to="/login" className={styles.authLink}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
