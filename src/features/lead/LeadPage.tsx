import { useState } from 'react';
import { DynamicForm } from '../../design-system/form/DynamicForm';
import type { FormValues } from '../../design-system/form/types';
import { leadFormConfig } from './leadFormConfig';
import { isVisible, validate } from './leadValidation';
import styles from './LeadPage.module.css';

export function LeadPage() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const handleSubmit = (values: FormValues) => {
    console.log('Lead submitted', values);
    setSubmitted(values);
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="lead-title">
        <header className={styles.header}>
          <h1 id="lead-title" className={styles.title}>
            New lead
          </h1>
          <p className={styles.intro}>
            Tell us how to reach you. Fields marked <span aria-hidden="true">*</span>
            <span className={styles.srOnly}>as required</span> are required.
          </p>
        </header>
        <DynamicForm
          config={leadFormConfig}
          validate={validate}
          isVisible={isVisible}
          onSubmit={handleSubmit}
          submitLabel="Submit lead"
        />
      </section>

      <section className={styles.output} aria-live="polite" aria-labelledby="output-title">
        {submitted && (
          <>
            <h2 id="output-title" className={styles.outputTitle}>
              Submitted values
            </h2>
            <pre className={styles.pre}>{JSON.stringify(submitted, null, 2)}</pre>
          </>
        )}
      </section>
    </main>
  );
}
