import styles from './devider.module.css';
import React from "react";

interface DividerProps {
    text: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
    return (
        <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerText}>{text}</div>
            <div className={styles.dividerLine} />
        </div>
    );
};