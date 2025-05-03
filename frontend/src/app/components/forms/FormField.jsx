import React from 'react';



const FormField = ({
  label,
  htmlFor,
  error,
  children,
  required = false,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={htmlFor}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;