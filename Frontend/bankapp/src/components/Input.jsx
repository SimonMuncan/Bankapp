import React from 'react';
import styles from '../pages/TransactionsPage/TransactionsPage.module.css'; 

const Input = ({ id, type, value, set, title, placeHolder}) => {

    return (
        <>
            <label htmlFor={id} className={styles.label}>{title}</label>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => set(event.target.value)}
                    placeholder={placeHolder}
                    className={styles.inputField}
                />
        </>
)};

export default Input;