import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import styles from './HomePage.module.css'; 
import { logout } from '../../store/actions/authActions'; 

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.navbarLogInText}>
          {isAuthenticated && user ? (
            <>
              Signed in as: {user.name}
              <Link onClick={handleLogout} className={`${styles.authLink} ${styles.logoutButton} ms-2`}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.authLink} me-2`}>Login</Link>
              <Link to="/register" className={styles.authLink}>Register</Link>
            </>
          )}
        </div>

        <h1 className={styles.heroTitle}>Welcome to Simon's Bank</h1>
        <p className={styles.heroSubtitle}>Your trusted partner for seamless financial management.</p>
        <div className={styles.buttonGroup}>
          <Link to={isAuthenticated && user ? "/wallet" : "/login"} className={styles.primaryButton}>
            View Your Wallet
          </Link>
          <Link to={isAuthenticated && user ? "/deposit" : "/login"} className={styles.secondaryButton}>
            Make a Deposit
          </Link>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Our Key Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureHeading}>Easy Transfers</h3>
            <p className={styles.featureDescription}>Send money to friends and family with just a few clicks. Fast, secure, and reliable.</p>
            <Link to={isAuthenticated && user ? "/transfer" : "/login"} className={styles.featureLink}>Transfer Now &rarr;</Link>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureHeading}>Transaction History</h3>
            <p className={styles.featureDescription}>Keep track of all your financial activities with detailed transaction logs.</p>
            <Link to={isAuthenticated && user ? "/transaction" : "/login"} className={styles.featureLink}>View History &rarr;</Link>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureHeading}>Secure & Reliable</h3>
            <p className={styles.featureDescription}>Your financial security is our top priority. We use advanced encryption to protect your data.</p>
            <span className={styles.featureLink}>Learn More &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
