import { describe, expect, it } from 'vitest';
import type { FormValues } from '../../design-system/form/types';
import { leadFormConfig } from './leadFormConfig';
import { isVisible, validate } from './leadValidation';

const valid: FormValues = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  leadType: 'individual',
  companyName: '',
  phone: '9876543210',
  notes: '',
  consent: true,
};

const errorsFor = (overrides: FormValues) => validate(leadFormConfig, { ...valid, ...overrides });

describe('validate', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validate(leadFormConfig, valid)).toEqual({});
  });

  describe('required', () => {
    it('fails on an empty string', () => {
      expect(errorsFor({ fullName: '' }).fullName).toBe('Enter your full name');
    });

    it('fails on a whitespace-only string', () => {
      expect(errorsFor({ fullName: '   ' }).fullName).toBe('Enter your full name');
    });

    it('fails on an unchecked checkbox', () => {
      expect(errorsFor({ consent: false }).consent).toBe('Please confirm you agree to be contacted');
    });

    it('reports every empty required field', () => {
      const errors = validate(leadFormConfig, {
        fullName: '', email: '', leadType: '', companyName: '', phone: '', notes: '', consent: false,
      });
      expect(Object.keys(errors).sort()).toEqual(['consent', 'email', 'fullName', 'leadType', 'phone']);
    });
  });

  describe('email', () => {
    it.each(['jane', 'jane@', 'jane@example', 'jane @example.com'])('rejects %s', (email) => {
      expect(errorsFor({ email }).email).toMatch(/valid email/);
    });

    it('accepts a valid address', () => {
      expect(errorsFor({ email: 'a.b+c@sub.example.co' }).email).toBeUndefined();
    });

    it('returns the required message (first failure) when empty', () => {
      expect(errorsFor({ email: '' }).email).toBe('Enter your email address');
    });
  });

  describe('phone (pattern)', () => {
    it.each(['987654321', '98765432100', '98765abcde', '98765 43210'])('rejects %s', (phone) => {
      expect(errorsFor({ phone }).phone).toBe('Phone must be exactly 10 digits, numbers only');
    });

    it('accepts exactly 10 digits', () => {
      expect(errorsFor({ phone: '0123456789' }).phone).toBeUndefined();
    });
  });

  describe('maxLength', () => {
    it('accepts 200 characters', () => {
      expect(errorsFor({ notes: 'x'.repeat(200) }).notes).toBeUndefined();
    });

    it('rejects 201 characters', () => {
      expect(errorsFor({ notes: 'x'.repeat(201) }).notes).toBe('Notes must be 200 characters or fewer');
    });

    it('treats notes as optional', () => {
      expect(errorsFor({ notes: '' }).notes).toBeUndefined();
    });
  });

  describe('visibility (Company name)', () => {
    it('produces no error for a hidden empty Company name', () => {
      const errors = errorsFor({ leadType: 'individual', companyName: '' });
      expect(errors).toEqual({});
      expect('companyName' in errors).toBe(false);
    });

    it('produces no error when lead type is unset', () => {
      expect(errorsFor({ leadType: '', companyName: '' }).companyName).toBeUndefined();
    });

    it('requires Company name when lead type is Company', () => {
      expect(errorsFor({ leadType: 'company', companyName: ' ' }).companyName).toBe('Enter the company name');
    });

    it('passes when lead type is Company and a name is given', () => {
      expect(errorsFor({ leadType: 'company', companyName: 'Acme' })).toEqual({});
    });
  });

  it('uses a default message when none is configured', () => {
    expect(
      validate([{ name: 'x', type: 'text', label: 'X', validations: [{ type: 'required' }] }], { x: '' }).x,
    ).toBe('This field is required');
  });

  it('does not mutate its inputs', () => {
    const values = { ...valid, fullName: '' };
    const snapshot = JSON.stringify(values);
    validate(leadFormConfig, values);
    expect(JSON.stringify(values)).toBe(snapshot);
  });
});

describe('isVisible', () => {
  const company = leadFormConfig.find((f) => f.name === 'companyName')!;

  it('is true for fields without visibleWhen', () => {
    expect(isVisible(leadFormConfig[0], {})).toBe(true);
  });

  it('follows the visibleWhen condition', () => {
    expect(isVisible(company, { leadType: 'company' })).toBe(true);
    expect(isVisible(company, { leadType: 'individual' })).toBe(false);
  });
});
