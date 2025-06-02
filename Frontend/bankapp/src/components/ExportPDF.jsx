import React, {useState} from 'react';
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 
import {getTransactionsPDF} from '../services/transactionsService';

const ExportPDF = ({ isLoading, debouncedSearchTerm, activeUserId, setError, title}) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
    if (!activeUserId) {
        alert("User not identified. Cannot export.");
        return;
    }
    setIsExporting(true);
    setError(null); 

    try {

        const responseBlob = await getTransactionsPDF(debouncedSearchTerm, activeUserId);

        const url = window.URL.createObjectURL(new Blob([responseBlob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions-${activeUserId}-${new Date().toISOString().slice(0,10)}.pdf`); 
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error("Error exporting PDF:", err);
        setError(err.response?.data?.detail || err.message || "Failed to export PDF.");
    } finally {
        setIsExporting(false);
    }
};
    return (
        <>
            <label htmlFor="exportToPDF" className={styles.label}>{title}</label>
            <div className={styles.formGroup}>
                <button
                    onClick={handleExportPDF}
                    className={styles.button} 
                    disabled={isLoading} 
                >
                    {isExporting ? 'Exporting...' : 'Export to PDF'}
                </button>
            </div>
        </>
)};

export default ExportPDF;