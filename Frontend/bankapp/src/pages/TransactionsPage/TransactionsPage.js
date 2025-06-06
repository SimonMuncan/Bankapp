import React, { useState, useEffect, useCallback } from "react";
import { getTransactions } from '../../services/transactionsService';
import styles from './TransactionsPage.module.css'; 
import { useSelector } from 'react-redux'; 
import Search from "../../components/Search";
import ExportPDF from "../../components/ExportPDF";
import Checkbox from "../../components/Chckbox";
import PaginationControls from "../../components/Pagination";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilters, setTypeFilters] = useState({
        incoming: false,
        outgoing: false,
    });
    const { user } = useSelector(state => state.auth);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const activeUserId = user.id;

    let transactionTypeParam = 'all'; 
    if (typeFilters.incoming && !typeFilters.outgoing) {
        transactionTypeParam = 'incoming';
    } else if (!typeFilters.incoming && typeFilters.outgoing) {
        transactionTypeParam = 'outgoing';
    }

    const fetchUserTransactions = useCallback(async (query, userId, page, currentTransactionType) => {
        if (!userId) {
            setTransactions([]);
            setIsLastPage(true); 
            return;
        }

        setIsLoading(true);
        setError(null); 
        const offset = (page - 1) * ITEMS_PER_PAGE;

        
        try {
            const response = await getTransactions(query, userId, ITEMS_PER_PAGE, offset, currentTransactionType);
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
            fetchUserTransactions(debouncedSearchTerm, activeUserId, currentPage, transactionTypeParam);
        }
    }, [debouncedSearchTerm, activeUserId, currentPage, transactionTypeParam, fetchUserTransactions]);


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
                <div className={styles.mainContentGrid}>
                    <div className={styles.leftPanel}>
                        <div className={styles.card}>
                            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchTitle="Find Transactions" searchLabel="Search transactions" searchPlaceholder="Marko"/>
                            <div className={styles.formGroup}> 
                                <label className={styles.label}>Filter by type:</label>
                                <div className={styles.checkboxGroup}>
                                    <Checkbox id="filterIncoming" name="incoming" checked={typeFilters.incoming} setTypeFilters={setTypeFilters} setCurrentPage={setCurrentPage}/>
                                    <Checkbox id="filterOutgoing" name="outgoing" checked={typeFilters.outgoing} setTypeFilters={setTypeFilters} setCurrentPage={setCurrentPage}/>
                                </div>
                            </div>
                            <ExportPDF isLoading={isLoading} debouncedSearchTerm={debouncedSearchTerm} activeUserId={activeUserId} setError={setError} title="Export PDF" transactionType={transactionTypeParam} />
                        </div>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <div className={`${styles.card} ${styles.transactionsCard}`}>
                        <h3 className={styles.cardTitle}>Recent Transactions</h3>
                        {isLoading && activeUserId ? (
                            <p className={styles.loadingMessage}>Loading transactions...</p>
                        ) : error ? (
                            <p className={styles.errorMessage}>Error: {error}</p>
                        ) : transactions.length === 0 ? (
                            <>
                                <p className={styles.noDataMessage}>No transactions found for User: {user.name}.</p>
                                <PaginationControls
                                        currentPage={currentPage}
                                        handlePreviousPage={handlePreviousPage}
                                        handleNextPage={handleNextPage}
                                        isLoading={isLoading}
                                        isLastPage={isLastPage}
                                    />
                            </>
                        ) : (
                            <>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.transactionTable}>
                                        <thead>
                                            <tr>
                                                <th>Sender</th>
                                                <th>Receiver</th>
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
                                                    <td>{transaction.sender || '-'}</td>
                                                    <td>{transaction.receiver || '-'}</td>
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
                                <PaginationControls
                                    currentPage={currentPage}
                                    handlePreviousPage={handlePreviousPage}
                                    handleNextPage={handleNextPage}
                                    isLoading={isLoading}
                                    isLastPage={isLastPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;