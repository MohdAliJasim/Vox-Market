import React from 'react';



const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow overflow-hidden';
  const hoverClasses = hoverable ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card subcomponents
Card.Image = function CardImage({ 
  src, 
  alt, 
  className = '' 
}) {
  return (
    <div className={`w-full ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

Card.Body = function CardBody({ 
  children, 
  className = '' 
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

Card.Title = function CardTitle({ 
  children, 
  className = '' 
}) {
  return <h3 className={`font-semibold text-lg mb-2 ${className}`}>{children}</h3>;
};

Card.Description = function CardDescription({ 
  children, 
  className = '' 
}) {
  return <p className={`text-neutral-600 ${className}`}>{children}</p>;
};

Card.Footer = function CardFooter({ 
  children, 
  className = '' 
}) {
  return <div className={`px-4 py-3 bg-neutral-50 ${className}`}>{children}</div>;
};

export default Card;