import React from 'react';

interface MagnetButtonProps {
  children?: React.ReactNode;
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const MagnetButton: React.FC<MagnetButtonProps> = ({
  children,
  text,
  href,
  onClick,
  className = '',
}) => {
  const defaultClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-bold text-accent-ink uppercase text-xs tracking-wider transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 active:translate-y-0 no-underline cursor-pointer';

  if (href) {
    return (
      <a href={href} className={`${defaultClasses} ${className}`}>
        {children || text}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${defaultClasses} ${className}`}>
      {children || text}
    </button>
  );
};
