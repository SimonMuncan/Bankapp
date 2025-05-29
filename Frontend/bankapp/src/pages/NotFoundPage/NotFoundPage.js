import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';



const NotFoundPage = () => {
    return(
    <div className={styles.notFoundContainer}>
        <div className={styles.contentWrapper}>
            <h1 className={styles.errorCode}>404</h1>
            <h2 className={styles.errorMessage}>Page Not Found</h2>
            <p className={styles.description}>
            Oops! The page you're looking for doesn't exist or has been moved.
            Don't worry, we'll help you find your way back.
            </p>
            <Link to="/" className={styles.homeButton}>
            Go to Homepage
            </Link>
        </div>
    </div>
    );
};


export default NotFoundPage;