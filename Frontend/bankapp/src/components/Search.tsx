import React from 'react'
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 
import { SearchProps } from '../types';

const Search: React.FC<SearchProps>  = ({ searchTerm, setSearchTerm, searchTitle, searchLabel, searchPlaceholder}) => {

  return (
    <>
        <h3 className={styles.cardTitle}>{searchTitle}</h3>
        <div className={styles.formGroup}>
            <label htmlFor="searchTerm" className={styles.label}>{searchLabel}</label>
            <input
                id="searchTerm"
                type="text"
                value={searchTerm || ''} 
                placeholder={`e.g., ${searchPlaceholder}`}
                className={styles.inputField}
                onChange={(event) => setSearchTerm(event.target.value)}
            />
        </div>
    </>
)};

export default Search