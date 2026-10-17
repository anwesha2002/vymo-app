import styles from './Textarea.module.css';

export interface TextareaProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
}

export function Textarea({ id, name, value, placeholder, rows = 4, onChange, onBlur, invalid, describedBy }: TextareaProps) {
  return (
    <textarea
      className={styles.textarea}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}
