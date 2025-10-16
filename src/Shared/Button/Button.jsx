import React from 'react';
import styles from './button.module.css';
const Button = ({ children ,click}) => {
    return (
        <button onClick={click} type="button" className={styles.btn}>
            <strong className={styles.strong}>{children}</strong>
            <div className={styles["container-stars"]}>
                <div className={styles.stars}></div>
            </div>
            <div className={styles.glow} >
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
        </button>

    )
}

export default Button