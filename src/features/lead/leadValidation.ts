import type { FieldConfig, FormErrors, FormValues, Validation } from '../../design-system/form/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A field is visible unless its `visibleWhen` condition is not met. */
export function isVisible(field: FieldConfig, values: FormValues): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.field] === field.visibleWhen.equals;
}

function isEmpty(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') return !value;
  return value === undefined || value.trim() === '';
}

/** Returns an error message if the rule fails, otherwise undefined. */
function check(rule: Validation, value: string | boolean | undefined): string | undefined {
  const str = typeof value === 'string' ? value : '';
  switch (rule.type) {
    case 'required':
      return isEmpty(value) ? (rule.message ?? 'This field is required') : undefined;
    case 'email':
      // Empty values are the job of `required`.
      return str !== '' && !EMAIL_RE.test(str.trim())
        ? (rule.message ?? 'Enter a valid email address')
        : undefined;
    case 'pattern':
      return str !== '' && !new RegExp(rule.value).test(str)
        ? (rule.message ?? 'Enter a value in the correct format')
        : undefined;
    case 'maxLength':
      return str.length > rule.value
        ? (rule.message ?? `Must be ${rule.value} characters or fewer`)
        : undefined;
  }
}

/**
 * Pure: returns the first failing message per visible field.
 * Hidden fields never produce errors.
 */
export function validate(config: FieldConfig[], values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of config) {
    if (!isVisible(field, values)) continue;
    for (const rule of field.validations) {
      const message = check(rule, values[field.name]);
      if (message) {
        errors[field.name] = message;
        break;
      }
    }
  }
  return errors;
}
