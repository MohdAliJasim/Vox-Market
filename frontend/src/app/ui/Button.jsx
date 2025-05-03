import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';





const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = false,
  icon,
  type = 'button',
  onClick,
  className = '',
  href,
  to,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none';
  
  // Variant styles
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm hover:shadow',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow',
    outline: 'border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-700',
    ghost: 'text-neutral-700 hover:bg-neutral-100',
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Conditional styles
  const widthClass = fullWidth ? 'w-full' : '';
  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';
  const disabledClass = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';

  // Focus styles based on variant
  const focusClasses = {
    primary: 'focus:ring-2 focus:ring-primary-300',
    secondary: 'focus:ring-2 focus:ring-secondary-300',
    accent: 'focus:ring-2 focus:ring-accent-300',
    outline: 'focus:ring-2 focus:ring-neutral-300',
    ghost: 'focus:ring-2 focus:ring-neutral-300',
  };
  
  // Combine all classes
  const allClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${roundedClass}
    ${disabledClass}
    ${focusClasses[variant]}
    ${className}
  `;
  
  // If href provided, render as anchor
  if (href) {
    return (
      <a href={href} className={allClasses} onClick={onClick}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </a>
    );
  }
  
  // If to provided, render as Link
  if (to) {
    return (
      <Link to={to} className={allClasses} onClick={onClick}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      className={allClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;