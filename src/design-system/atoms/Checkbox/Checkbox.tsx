import styles from './Checkbox.module.css';

export interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  label: string;
  required?: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
}

export function Checkbox({ id, name, checked, label, required, onChange, onBlur, invalid, describedBy }: CheckboxProps) {
  return (
    <div className={styles.row}>
      <input
        className={styles.box}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && (
          <>
            <span className={styles.marker} aria-hidden="true"> *</span>
            <span className={styles.srOnly}> (required)</span>
          </>
        )}
      </label>
    </div>
  );
}
