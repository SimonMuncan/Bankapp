import React from 'react';
import styles from '../pages/RegisterPage/RegistarPage.module.css';
import { InputPropsRegister } from '../types';

const InputRegister: React.FC<InputPropsRegister>  = ({ id, type, value, set, title, placeHolder, isLoading}) => {

    return (
        <>
            <label htmlFor={id} className={styles.formLabel}>{title}</label>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => set(event.target.value)}
                    placeholder={placeHolder}
                    required
                    disabled={isLoading}
                    className={styles.formInput}
                />

        </>
)};

export default InputRegister;