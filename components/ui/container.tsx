import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={`mx-auto max-w-7xl ${className || ''}`}>
      {children}
    </div>
  );
};

export default Container;