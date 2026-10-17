import styles from './Input.module.css';

export interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email';
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
}

export function Input({ id, name, type = 'text', value, placeholder, onChange, onBlur, invalid, describedBy }: InputProps) {
  return (
    <input
      className={styles.input}
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}
