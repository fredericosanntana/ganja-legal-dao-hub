
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo = ({ size = 'md', withText = true }: LogoProps) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`rounded-full overflow-hidden ${sizes[size]}`}>
        <img 
          src="/lovable-uploads/d2c69709-b369-4e0c-a011-642206695b8b.png" 
          alt="GanjaDAO Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {withText && (
        <span className="font-heading font-bold text-xl text-foreground hidden sm:inline-block">
          GanjaDAO
        </span>
      )}
    </Link>
  );
};

export default Logo;
