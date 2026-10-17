import type { ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}

export function Button({ type = 'button', disabled, children, onClick, fullWidth }: ButtonProps) {
  return (
    <button
      className={fullWidth ? `${styles.button} ${styles.fullWidth}` : styles.button}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
