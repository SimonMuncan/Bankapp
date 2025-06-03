import React from 'react';
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 

const PaginationControls = ({ 
    currentPage, 
    handlePreviousPage, 
    handleNextPage, 
    isLoading, 
    isLastPage 
}) => {
    return (
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
    );
};

export default PaginationControls;