import React, { useEffect, useState } from 'react';
import { getWalletAndUser } from '../../services/walletService'; 
import styles from './WalletPage.module.css';
import { useSelector } from 'react-redux'; 

const WalletPage = () => {
    const [walletBalance, setWalletBalance] = useState(0); 
    const [userName, setUserName] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useSelector(state => state.auth);
    
    const fetchWalletData = async (user_id) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWalletAndUser(user_id);
            setUserName(data.User.name); 
            setWalletBalance(data.Wallet.balance);
        } catch (err) {
            console.error("Error fetching wallet data:", err);
            setError(err.message || "An unexpected error occurred.");
            setWalletBalance(0); 
            setUserName('');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData(user.id);
    }, [user.id])
    
  return (
         <div className={styles.walletContainer}>
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Your Wallet Dashboard</h1>
                <p className={styles.heroSubtitle}>Quickly view your balance and user details.</p>
            </div>
                <div className={styles.rightPanel}> 
                    <div className={`${styles.card} ${styles.balanceCard}`}> 
                        <h3 className={styles.cardTitle}>Current Balance</h3>
                        {!isLoading && !error && walletBalance !== null ? (
                            <div className={styles.walletInfo}>
                                <p className={styles.infoLine}>
                                    <span className={styles.infoLabel}>User:</span>
                                    <span className={styles.infoValue}>{userName || 'N/A'}</span>
                                </p>
                                <p className={styles.infoLine}>
                                    <span className={styles.infoLabel}>Balance:</span>
                                    <span className={styles.balanceValue}>${walletBalance.toFixed(2)}</span>
                                </p>
                            </div>
                        ) : (
                            <p className={styles.noDataMessage}>
                                    "No wallet data found." 
                            </p>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default WalletPage;