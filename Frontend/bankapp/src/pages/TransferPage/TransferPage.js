import { useState } from "react";
import {transferMoney} from '../../services/transferService';
import styles from './TransferPage.module.css';
import { useSelector } from 'react-redux'; 
import Input from "../../components/Input";



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
                        <Input id="receiverIdInput" type="number" value={receiverIdInput} set={setReceiverIdInput} title="Receiver User ID" placeHolder="e.g., 456"/>
                    </div>
                    <div className={styles.formGroup}>
                        <Input id="amount" type="number" value={amount} set={setAmount} title="Amount to Transfer" placeHolder="e.g., 50.00"/>
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