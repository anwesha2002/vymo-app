import type { ReactNode } from 'react';
import { errorId, hintId } from './fieldIds';
import styles from './Field.module.css';

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** `checkbox`: the control renders its own label beside the box. */
  variant?: 'default' | 'checkbox';
  /** Optional trailing text in the hint row, e.g. a character count. */
  counter?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, error, required, variant = 'default', counter, children }: FieldProps) {
  // Checkbox hint/error line up with the label beside the box.
  const indented = (className: string) => (variant === 'checkbox' ? `${className} ${styles.indented}` : className);

  return (
    <div className={styles.field}>
      {variant === 'default' && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && (
            <>
              <span className={styles.marker} aria-hidden="true"> *</span>
              <span className={styles.srOnly}> (required)</span>
            </>
          )}
        </label>
      )}
      {children}
      {(hint || counter) && (
        <div className={indented(styles.meta)}>
          {hint && (
            <p className={styles.hint} id={hintId(id)}>
              {hint}
            </p>
          )}
          {counter && (
            <span className={styles.counter} aria-hidden="true">
              {counter}
            </span>
          )}
        </div>
      )}
      {error && (
        <p className={indented(styles.error)} id={errorId(id)} role="alert">
          <span className={styles.icon} aria-hidden="true">!</span>
          <span className={styles.srOnly}>Error: </span>
          <span className={styles.errorText}>{error}</span>
        </p>
      )}
    </div>
  );
}
