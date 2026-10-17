import type { FieldConfig } from '../../design-system/form/types';

export const leadFormConfig: FieldConfig[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full name',
    validations: [{ type: 'required', message: 'Enter your full name' }],
    span: 'half',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'name@example.com',
    hint: "We'll only use this to contact you",
    validations: [
      { type: 'required', message: 'Enter your email address' },
      { type: 'email', message: 'Enter a valid email address, like name@example.com' },
    ],
    span: 'half',
  },
  {
    name: 'leadType',
    type: 'select',
    label: 'Lead type',
    placeholder: 'Select a lead type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'company', label: 'Company' },
    ],
    validations: [{ type: 'required', message: 'Select a lead type' }],
    span: 'half',
  },
  {
    name: 'companyName',
    type: 'text',
    label: 'Company name',
    visibleWhen: { field: 'leadType', equals: 'company' },
    validations: [{ type: 'required', message: 'Enter the company name' }],
    span: 'half',
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    hint: '10 digits, numbers only',
    validations: [
      { type: 'required', message: 'Enter your phone number' },
      { type: 'pattern', value: '^\\d{10}$', message: 'Phone must be exactly 10 digits, numbers only' },
    ],
    span: 'half',
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    hint: 'Optional, up to 200 characters',
    validations: [{ type: 'maxLength', value: 200, message: 'Notes must be 200 characters or fewer' }],
    span: 'full',
    showCount: true,
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'I agree to be contacted',
    validations: [{ type: 'required', message: 'Please confirm you agree to be contacted' }],
    span: 'full',
  },
];
