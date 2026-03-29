import React, { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        { 'btn--full': fullWidth },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="btn__loader" /> : children}
    </button>
  );
};

export default Button;
