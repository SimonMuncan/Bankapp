import { useState } from "react";
import { depositToWallet } from '../../services/depositService';
import styles from './DepositPage.module.css'; 
import { useSelector } from 'react-redux'; 


const DepositPage = () => {
    const [amount, setAmount] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); 
    const [walletBalance, setWalletBalance] = useState(null); 
    const { user } = useSelector(state => state.auth);

    const handleDeposit = async () => { 
        setError(null);
        setSuccessMessage(null);
        setWalletBalance(null); 

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Invalid amount! Must be a positive number.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await depositToWallet(user.id, parsedAmount);
            setWalletBalance(response.balance);
            setSuccessMessage(`Deposit successful!`);
            setAmount('');
        } catch (err) {
            console.error("Deposit error:", err);
            setError(err.response?.data?.detail || err.message || "An unexpected error occurred during deposit.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAmountInputChange = (event) => {
        setAmount(event.target.value);
    }

    return (
         <div className={styles.depositContainer}> 
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Make a Secure Deposit</h1>
                <p className={styles.heroSubtitle}>
                    Top up your wallet easily and securely. Enter your details below.
                </p>

                <div className={styles.depositCard}> 
                    <div className={styles.formGroup}>
                        <label htmlFor="amount" className={styles.label}>Amount to Deposit</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={handleAmountInputChange}
                            placeholder="e.g., 100.00"
                            min="0.01"
                            step="0.01"
                            className={styles.inputField}
                        />
                    </div>

                    <button
                        onClick={handleDeposit}
                        disabled={isLoading || !amount}
                        className={styles.button}
                    >
                        {isLoading ? 'Depositing...' : 'Confirm Deposit'}
                    </button>
                    {isLoading && <p className={styles.loadingMessage}>Processing deposit...</p>}
                    {!isLoading && error && <p className={styles.errorMessage}>Error: {error}</p>}
                    {!isLoading && successMessage && !error && <p className={styles.successMessage}>{successMessage}</p>}
                    {!isLoading && walletBalance !== null && successMessage && (
                        <p className={styles.balanceDisplay}>
                            New Balance: <span className={styles.balanceValue}>${walletBalance.toFixed(2)}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.instructionsSection}>
                <h2 className={styles.instructionsTitle}>How It Works</h2>
                <div className={styles.instructionGrid}>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>1. Enter Details</h3>
                        <p className={styles.instructionDescription}>Provide your unique user ID and the amount you wish to add to your wallet.</p>
                    </div>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>2. Confirm & Deposit</h3>
                        <p className={styles.instructionDescription}>Review your input and click 'Confirm Deposit'. Your funds will be securely added.</p>
                    </div>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>3. Instantly Available</h3>
                        <p className={styles.instructionDescription}>Your updated balance will reflect immediately, ready for transfers or other transactions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositPage;