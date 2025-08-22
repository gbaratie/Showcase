import React from 'react';

export function FormInput({ label, type = "text", ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} className="input-field" {...props} />
    </div>
  );
}

export function FormTextArea({ label, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea className="input-field" {...props} />
    </div>
  );
}
