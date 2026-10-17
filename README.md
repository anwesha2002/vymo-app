# Lead capture form

A config-driven lead form built on a small design system.
It uses React, TypeScript, Vite, and CSS Modules, with no component library.

## Install and run

Requires Node 20 or later.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit tests for validate()
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Folder layout

```
src/
  design-system/                 generic, knows nothing about leads
    tokens/
      tokens.css                 CSS variables: color, spacing, type, radius, focus
      breakpoints.ts             BREAKPOINTS = { mobile: 768, desktop: 1024 }
    atoms/                       Input, Select, Textarea, Checkbox, Button (+ index.ts)
    molecules/Field/             Field.tsx, Field.module.css, fieldIds.ts
    form/
      DynamicForm.tsx            form state, blur/submit behaviour, renders fields
      DynamicForm.module.css     grid + sticky submit bar
      fieldRegistry.ts           field type → atom
      types.ts                   FieldConfig, Validation, FormValues, FormErrors
  features/lead/
    leadFormConfig.ts            the form, as a FieldConfig[]
    leadValidation.ts            validate() and isVisible(): pure, no React
    leadValidation.test.ts
    LeadPage.tsx, LeadPage.module.css
  App.tsx, main.tsx
  index.css                      imports tokens.css, global reset
```

Dependencies only point one way: `features/` imports from `design-system/`, never the reverse.

## Tokens, atoms, and the form

- **Tokens:** `src/design-system/tokens/tokens.css`, loaded once by `src/index.css`. `breakpoints.ts` holds the breakpoint values.
- **Atoms:** `src/design-system/atoms/<Name>/`, re-exported from `atoms/index.ts`. They are controlled, take a value, a label, and events, and contain no lead rules.
- **Field:** `src/design-system/molecules/Field/`. It renders the label, the required marker, the hint, and the error (`role="alert"`).
- **Form:** `src/design-system/form/`. `DynamicForm` looks up each field's atom in `fieldRegistry` and takes `validate` and `isVisible` as props.

## Config and validation rules

- **Config:** `src/features/lead/leadFormConfig.ts`. To add a field, add one entry. No JSX changes are needed:

  ```ts
  { name: 'jobTitle', type: 'text', label: 'Job title',
    validations: [{ type: 'maxLength', value: 80 }], span: 'half' }
  ```

- **Validation:** `src/features/lead/leadValidation.ts`.
  - `validate(config, values)` runs the `required`, `email`, `pattern`, and `maxLength` rules, skips hidden fields, and returns the first error message per field.
  - `isVisible(field, values)` evaluates `visibleWhen`.
  - `LeadPage.tsx` passes both functions to `DynamicForm`.
  - Tests are in `leadValidation.test.ts`.

## Desktop and mobile layout

| File | Owns |
|---|---|
| `design-system/form/DynamicForm.module.css` | The form grid. Over 1024px it has 2 columns: `span: 'half'` takes one column, `'full'` takes both, and the button sits at the content edge. At 1024px and below it has 1 column and a sticky submit bar with `env(safe-area-inset-bottom)` padding. |
| `features/lead/LeadPage.module.css` | The page container: up to 960px wide on desktop, a centered 640px column on tablet (768–1024px), and edge to edge with a 16px gutter under 768px. It also sets `--form-bleed`, so the sticky bar spans the full width of the card. |
| `design-system/atoms/*/*.module.css` | Full-width controls with a 44px touch height and 16px text, so iOS doesn't zoom on focus. `scroll-margin-bottom` keeps a focused field visible above the sticky bar. |
| `design-system/molecules/Field/Field.module.css` | Wrapping for labels, hints, and errors (`overflow-wrap: anywhere`), so text never overflows at 320px. |
| `src/index.css`, `index.html` | The `box-sizing` reset and the viewport meta tag. |

Media queries use the literal values `768px` and `1024px`, because CSS variables can't be used inside media queries. Those values match `breakpoints.ts`.
