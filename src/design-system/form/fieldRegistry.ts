import { createElement, type ReactNode } from 'react';
import { Checkbox, Input, Select, Textarea } from '../atoms';
import type { FieldConfig, FieldType } from './types';

export interface RendererProps {
  field: FieldConfig;
  id: string;
  value: string | boolean;
  required: boolean;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: string | boolean) => void;
  onBlur: () => void;
}

export interface FieldRenderer {
  /** `checkbox`: the control carries its own label, Field shows hint/error below it. */
  variant: 'default' | 'checkbox';
  render: (props: RendererProps) => ReactNode;
}

const asString = (value: string | boolean) => (typeof value === 'string' ? value : '');

/** Props every atom takes, straight from the renderer props. */
const controlProps = ({ field, id, invalid, describedBy, onChange, onBlur }: RendererProps) => ({
  id,
  name: field.name,
  invalid,
  describedBy,
  onChange,
  onBlur,
});

/** Shared props for the string-valued controls (Input, Select, Textarea). */
const textProps = (p: RendererProps) => ({
  ...controlProps(p),
  value: asString(p.value),
  placeholder: p.field.placeholder,
});

const textLike = (type: 'text' | 'email'): FieldRenderer => ({
  variant: 'default',
  render: (p) => createElement(Input, { ...textProps(p), type }),
});

/**
 * Maps every FieldType to the atom that renders it. Typed as a full Record,
 * so adding a FieldType without registering a renderer fails type-checking.
 */
export const fieldRegistry: Record<FieldType, FieldRenderer> = {
  text: textLike('text'),
  email: textLike('email'),
  select: {
    variant: 'default',
    render: (p) => createElement(Select, { ...textProps(p), options: p.field.options ?? [] }),
  },
  textarea: {
    variant: 'default',
    render: (p) => createElement(Textarea, { ...textProps(p), rows: 4 }),
  },
  checkbox: {
    variant: 'checkbox',
    render: (p) =>
      createElement(Checkbox, {
        ...controlProps(p),
        checked: p.value === true,
        label: p.field.label,
        required: p.required,
      }),
  },
};
