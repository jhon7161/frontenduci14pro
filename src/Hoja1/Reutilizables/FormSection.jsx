import React from 'react';

const FormSection = ({ title, children }) => {
  return (
    <section className="form-section form-card">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
};

export default FormSection;