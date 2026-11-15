import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'span';
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  tag = 'h1',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const letters = containerRef.current?.querySelectorAll('.split-char');
      if (!letters || letters.length === 0) return;

      gsap.fromTo(
        letters,
        { opacity: 0, y: 35, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.035,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef, dependencies: [text] }
  );

  const words = text.split(' ');
  const Tag = tag;

  return (
    <Tag ref={containerRef} className={`overflow-hidden inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em]">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="split-char inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};
