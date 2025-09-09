// src/components/KeyboardNavigation.jsx
import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

export function KeyboardNavigation({ children, onEscape, onEnter, onArrowUp, onArrowDown }) {
  const containerRef = useRef(null);
  const { trapFocus } = useAccessibility();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.(e);
          break;
        case 'Enter':
          onEnter?.(e);
          break;
        case 'ArrowUp':
          onArrowUp?.(e);
          break;
        case 'ArrowDown':
          onArrowDown?.(e);
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, onArrowUp, onArrowDown]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
}

// Componente para skip links
export function SkipLink({ href, children, ...props }) {
  return (
    <a
      href={href}
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#000',
        color: '#fff',
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: 1000,
        transition: 'top 0.3s'
      }}
      onFocus={(e) => {
        e.target.style.top = '6px';
      }}
      onBlur={(e) => {
        e.target.style.top = '-40px';
      }}
      {...props}
    >
      {children}
    </a>
  );
}

// Componente para indicador de foco
export function FocusIndicator({ children, showOnHover = false }) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const shouldShow = isFocused || (showOnHover && isHovered);

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        outline: shouldShow ? '2px solid #0066cc' : 'none',
        outlineOffset: '2px',
        borderRadius: '4px'
      }}
    >
      {children}
    </div>
  );
}
