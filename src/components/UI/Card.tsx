import React from 'react';
import clsx from 'clsx';
import './Card.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <div className={clsx('card', className)} {...rest}>
      {children}
    </div>
  );
};

export default Card;
