export type FieldType = 'text' | 'email' | 'select' | 'textarea' | 'checkbox';

export type Validation =
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'pattern'; value: string; message?: string }
  | { type: 'maxLength'; value: number; message?: string };

export interface VisibleWhen {
  field: string;
  equals: string;
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; // select only
  validations: Validation[];
  visibleWhen?: VisibleWhen;
  span?: 'half' | 'full'; // desktop layout, driven by config
  showCount?: boolean; // character counter
}

export type FormValues = Record<string, string | boolean>;
export type FormErrors = Record<string, string | undefined>;

export type ValidateFn = (config: FieldConfig[], values: FormValues) => FormErrors;
export type IsVisibleFn = (field: FieldConfig, values: FormValues) => boolean;
