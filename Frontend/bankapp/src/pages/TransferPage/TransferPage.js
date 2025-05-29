import { useState } from "react";
import {transferMoney} from '../../services/transferService';
import styles from './TransferPage.module.css';
import { useSelector } from 'react-redux'; 



const TransferPage = () => {
    const [ receiverIdInput, setReceiverIdInput] = useState('');
    const [ amount, setAmount ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError] = useState(null);
    const [ responseMessage, setResponseMessage] = useState('');
    const { user } = useSelector(state => state.auth);


    const handleTransfer = async (senderId, receiverId, amount) => {
        if (!receiverId || !amount) {
                setError('Please fill all fields!');
                setAmount(0);
                setReceiverIdInput('');
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await transferMoney(senderId, receiverId, amount);
            setResponseMessage(response.detail);
            setAmount(0);
            setReceiverIdInput('');
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
            setAmount(0);
            setReceiverIdInput('');
        } finally {
            setIsLoading(false);
        }
    }

    const handleReceiverIdInput = (event) => {
        setReceiverIdInput(event.target.value);
    }

    const handleAmountInput = (event) => {
        setAmount(event.target.value);
    }
    
    const handleTransferButtonClick = () => {
        handleTransfer(user.id, receiverIdInput, amount);
    };

     return (
        <div className={styles.transferContainer}> 
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Transfer Funds Securely</h1>
                <p className={styles.heroSubtitle}>
                    Send money to any user, anywhere, with confidence.
                </p>

                <div className={styles.transferCard}> 
                    <div className={styles.formGroup}>
                        <label htmlFor="receiverIdInput" className={styles.label}>Receiver User ID</label>
                        <input
                            id="receiverIdInput"
                            type="number"
                            value={receiverIdInput}
                            onChange={handleReceiverIdInput}
                            placeholder="e.g., 456"
                            min="1"
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amount" className={styles.label}>Amount to Transfer</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={handleAmountInput}
                            placeholder="e.g., 50.00"
                            min="0.01"
                            step="0.01"
                            className={styles.inputField}
                        />
                    </div>

                    <button
                        onClick={handleTransferButtonClick}
                        disabled={isLoading || !receiverIdInput || !amount}
                        className={styles.button}
                    >
                        {isLoading ? 'Processing...' : 'Confirm Transfer'}
                    </button>

                    {isLoading && <p className={styles.loadingMessage}>Processing your request...</p>}
                    {!isLoading && error && <p className={styles.errorMessage}>Error: {error}</p>}
                    {!isLoading && responseMessage && !error && <p className={styles.successMessage}>{responseMessage}</p>}
                </div>
            </div>

            <div className={styles.instructionsSection}>
                <h2 className={styles.instructionsTitle}>How Transfers Work</h2>
                <div className={styles.instructionGrid}>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>1. Input Details</h3>
                        <p className={styles.instructionDescription}>Enter the sender's and receiver's user IDs along with the transfer amount.</p>
                    </div>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>2. Verify & Send</h3>
                        <p className={styles.instructionDescription}>Double-check the details and click 'Confirm Transfer' to initiate the transaction.</p>
                    </div>
                    <div className={styles.instructionCard}>
                        <h3 className={styles.instructionHeading}>3. Instant Confirmation</h3>
                        <p className={styles.instructionDescription}>Receive instant feedback on your transfer status, ensuring peace of mind.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default TransferPage;