import React from 'react';
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 
import { CheckboxProps } from '../types';

const Checkbox: React.FC<CheckboxProps>  = ({ id, name, checked, setTypeFilters, setCurrentPage }) => {

    const handleTypeFilterChange = (event) => {
        const { name, checked } = event.target;
            setTypeFilters(prevFilters => ({
                ...prevFilters,
                [name]: checked,
            }));
            setCurrentPage(1); 
    };

    return (
        <div className={styles.checkboxWrapper}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={handleTypeFilterChange}
                className={styles.checkboxInput}
            />
            <label htmlFor={id} className={styles.checkboxLabel}>{name}</label> 
        </div>
)};

export default Checkbox;