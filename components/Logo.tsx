import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className="text-xl font-semibold tracking-tight text-black">
        Spacetact
      </span>
    </div>
  );
};

export default Logo;