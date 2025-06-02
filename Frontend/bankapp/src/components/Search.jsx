import React from 'react'
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 

const Search = ({ searchTerm, setSearchTerm, searchTitle, searchLabel, searchPlaceholder}) => {

  return (
    <div className={styles.mainContentGrid}>
        <div className={styles.leftPanel}>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>{searchTitle}</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="searchTerm" className={styles.label}>{searchLabel}</label>
                    <input
                        id="searchTerm"
                        type="text"
                        value={searchTerm} 
                        placeholder={`e.g., ${searchPlaceholder}`}
                        className={styles.inputField}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
            </div>
        </div>
    </div>
)
}

export default Search