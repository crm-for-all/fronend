import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={clsx('input-group', { 'input-group--full': fullWidth })}>
        {label && (
          <label htmlFor={inputId} className="input-group__label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx('input-group__input', { 'input-group__input--error': error }, className)}
          {...props}
        />
        {error && <span className="input-group__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
