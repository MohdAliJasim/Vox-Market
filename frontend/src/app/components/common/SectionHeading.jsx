import React from 'react';



const SectionHeading= ({
  title,
  subtitle,
  alignment = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-8 ${alignmentClasses[alignment]} ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">{title}</h2>
      {subtitle && <p className="text-neutral-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;