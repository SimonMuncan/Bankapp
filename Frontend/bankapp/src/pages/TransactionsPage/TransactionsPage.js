import React, { useState, useEffect, useCallback } from "react";
import { getTransactions } from '../../services/transactionsService';
import styles from './TransactionsPage.module.css'; 
import { useSelector } from 'react-redux'; 

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(state => state.auth);

    const activeUserId = user.id
    const fetchUserTransactions = useCallback(async (userId, page) => {
        if (!userId) {
            setTransactions([]);
            setIsLastPage(true); 
            return;
        }

        setIsLoading(true);
        setError(null); 
        const offset = (page - 1) * ITEMS_PER_PAGE;

        try {
            const response = await getTransactions(userId, ITEMS_PER_PAGE, offset);
            if (Array.isArray(response)) {
                setTransactions(response);
                setIsLastPage(response.length < ITEMS_PER_PAGE); 
            } else {
                console.warn("API response does not contain an expected array of transactions:", response);
                setTransactions([]);
                setIsLastPage(true);
                setError("Invalid response format from server.");
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError(err.response?.data?.detail || err.message || "Failed to fetch transactions.");
            setTransactions([]);
            setIsLastPage(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeUserId) { 
            fetchUserTransactions(activeUserId, currentPage);
        }
    }, [activeUserId, currentPage, fetchUserTransactions]); 


    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };


    return (
        <div className={styles.transactionsContainer}>
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Transaction History</h1>
                <p className={styles.heroSubtitle}>View a detailed log of all financial activities.</p>
            </div>

            <div className={styles.mainContentGrid}>
                <div className={styles.leftPanel}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Find Transactions</h3>
                        <div className={styles.formGroup}>
                            <label htmlFor="userIdInput" className={styles.label}>Search transaction:</label>
                            <input
                                id="userIdInput"
                                type="number"
                                value=""
                                placeholder="e.g., 123"
                                min="1"
                                className={styles.inputField}
                                disabled="true"
                            />
                        </div>
                        <button
                            disabled="true"
                            className={styles.button}
                        >
                            {isLoading && activeUserId ? 'Loading...' : 'Fetch Transactions'}
                        </button>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={`${styles.card} ${styles.transactionsCard}`}>
                        <h3 className={styles.cardTitle}>Recent Transactions</h3>
                        {isLoading && activeUserId ? (
                            <p className={styles.loadingMessage}>Loading transactions...</p>
                        ) : error ? (
                            <p className={styles.errorMessage}>Error: {error}</p>
                        ) : transactions.length === 0 && activeUserId ? (
                            <p className={styles.noDataMessage}>No transactions found for User ID: {activeUserId}.</p>
                        ) : transactions.length === 0 && !activeUserId ? (
                            <p className={styles.noDataMessage}>Enter a user ID to view transactions.</p>
                        ) : (
                            <>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.transactionTable}>
                                        <thead>
                                            <tr>
                                                <th>Sender ID</th>
                                                <th>Receiver ID</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Date & Time</th>
                                                <th>Status</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id || `${transaction.sender_id}-${transaction.receiver_id}-${transaction.timestamp}`}>
                                                    <td>{transaction.sender_id || '-'}</td>
                                                    <td>{transaction.receiver_id || '-'}</td>
                                                    <td className={transaction.status && transaction.receiver_id === parseInt(activeUserId) ? styles.amountSuccess : styles.amountFailed}>
                                                        {transaction.sender_id === parseInt(activeUserId) ? `- $${parseFloat(transaction.amount).toFixed(2)}` : `+ $${parseFloat(transaction.amount).toFixed(2)}`}
                                                    </td>
                                                    <td>{transaction.sender_id === parseInt(activeUserId) ? 'Outgoing' : 'Incoming'}</td>
                                                    <td>{transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}</td>
                                                    <td className={transaction.status ? styles.statusSuccess : styles.statusFailed}>
                                                        {transaction.status ? 'Successful' : 'Failed'}
                                                    </td>
                                                    <td>{transaction.description || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.paginationControls}>
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={isLoading || currentPage === 1}
                                        className={styles.paginationButton}
                                    >
                                        &larr; Previous
                                    </button>
                                    <span className={styles.pageIndicator}>Page {currentPage}</span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={isLoading || isLastPage}
                                        className={styles.paginationButton}
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;