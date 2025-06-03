import React from 'react';
import styles from '../pages/LoginPage/LoginPage.module.css';

const InputLogin = ({ id, type, value, set, title, placeHolder, isLoading, dispatch, reduxError, clearAuthError}) => {

    return (
        <>
            <label htmlFor={id} className={styles.formLabel}>{title}</label>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => {
                        set(event.target.value);
                        if(reduxError) dispatch(clearAuthError());
                    }} 
                    placeholder={placeHolder}
                    required
                    disabled={isLoading}
                    className={styles.formInput}
                />

        </>
)};

export default InputLogin;