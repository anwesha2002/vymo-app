import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '../atoms';
import { Field } from '../molecules/Field/Field';
import { describedById } from '../molecules/Field/fieldIds';
import { fieldRegistry } from './fieldRegistry';
import type { FieldConfig, FormErrors, FormValues, IsVisibleFn, ValidateFn } from './types';
import styles from './DynamicForm.module.css';

export interface DynamicFormProps {
  config: FieldConfig[];
  /** Pure validator: (config, values) => errors. Injected so the design system stays domain-free. */
  validate: ValidateFn;
  /** Visibility rule shared with the validator. */
  isVisible: IsVisibleFn;
  onSubmit: (values: FormValues) => void;
  submitLabel?: string;
}

const initialValue = (field: FieldConfig) => (field.type === 'checkbox' ? false : '');

const initialValues = (config: FieldConfig[]): FormValues =>
  Object.fromEntries(config.map((f) => [f.name, initialValue(f)]));

const isRequired = (field: FieldConfig) => field.validations.some((v) => v.type === 'required');

/** "12/200" for fields with `showCount` and a maxLength rule, otherwise undefined. */
function counterText(field: FieldConfig, value: string | boolean): string | undefined {
  const maxLength = field.validations.find((v) => v.type === 'maxLength')?.value;
  if (!field.showCount || maxLength === undefined || typeof value !== 'string') return undefined;
  return `${value.length}/${maxLength}`;
}

function omit<T extends Record<string, unknown>>(record: T, keys: string[]): T {
  const next = { ...record };
  for (const key of keys) delete next[key];
  return next;
}

export function DynamicForm({ config, validate, isVisible, onSubmit, submitLabel = 'Submit' }: DynamicFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(config));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const idPrefix = useId();

  const visibleFields = config.filter((f) => isVisible(f, values));

  // Focus the first invalid field after the errors have rendered, so the
  // browser scrolls it (and its message) into view with scroll-margin applied.
  useEffect(() => {
    const name = pendingFocus.current;
    if (!name) return;
    pendingFocus.current = null;
    const el = formRef.current?.elements.namedItem(name);
    if (el instanceof HTMLElement) el.focus();
  }, [errors]);

  const handleChange = (name: string, value: string | boolean) => {
    const next: FormValues = { ...values, [name]: value };

    // Fields hidden by this change are reset and lose their error/touched state.
    const hidden = config.filter((f) => isVisible(f, values) && !isVisible(f, next));
    for (const field of hidden) next[field.name] = initialValue(field);
    const hiddenNames = hidden.map((f) => f.name);

    setValues(next);
    setTouched((t) => omit(t, hiddenNames));
    setErrors((prev) => {
      const kept = omit(prev, hiddenNames);
      return touched[name] ? { ...kept, [name]: validate(config, next)[name] } : kept;
    });
  };

  const handleBlur = (name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(config, values)[name] }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(Object.fromEntries(visibleFields.map((f) => [f.name, true])));

    const nextErrors = validate(config, values);
    setErrors(nextErrors);

    const firstInvalid = visibleFields.find((f) => nextErrors[f.name]);
    if (firstInvalid) {
      pendingFocus.current = firstInvalid.name;
      return;
    }
    onSubmit(Object.fromEntries(visibleFields.map((f) => [f.name, values[f.name]])));
  };

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={handleSubmit}>
      {visibleFields.map((field) => {
        const renderer = fieldRegistry[field.type];
        const id = `${idPrefix}-${field.name}`;
        const value = values[field.name] ?? initialValue(field);
        const error = touched[field.name] ? errors[field.name] : undefined;
        const required = isRequired(field);

        return (
          <div key={field.name} className={field.span === 'half' ? styles.half : styles.full}>
            <Field
              id={id}
              label={field.label}
              hint={field.hint}
              error={error}
              required={required}
              variant={renderer.variant}
              counter={counterText(field, value)}
            >
              {renderer.render({
                field,
                id,
                value,
                required,
                invalid: Boolean(error),
                describedBy: describedById(id, Boolean(error), Boolean(field.hint)),
                onChange: (v) => handleChange(field.name, v),
                onBlur: () => handleBlur(field.name),
              })}
            </Field>
          </div>
        );
      })}
      <div className={styles.actions}>
        <div className={styles.buttonWrap}>
          <Button type="submit" fullWidth>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
