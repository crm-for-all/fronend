import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import './NotesPopover.scss';

interface NotesPopoverProps {
  notes: string;
  children: React.ReactNode;
}

const NotesPopover: React.FC<NotesPopoverProps> = ({ notes, children }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; direction: 'top' | 'bottom' } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 450;
      const popoverMaxHeight = 400;
      const margin = 16;
      let left = rect.left + window.scrollX;
      
      if (left + popoverWidth > window.innerWidth + window.scrollX - margin) {
        left = window.innerWidth + window.scrollX - popoverWidth - margin;
      }

      const spaceBelow = window.innerHeight - rect.bottom;
      const direction: 'top' | 'bottom' = spaceBelow < popoverMaxHeight ? 'top' : 'bottom';
      
      const top = direction === 'bottom' 
        ? rect.bottom + window.scrollY 
        : rect.top + window.scrollY - 8;

      return { top, left, width: rect.width, direction };
    }
    return null;
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const newCoords = calculatePosition();
    if (newCoords) {
      setCoords(newCoords);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  // Keep position in sync during scroll/resize
  useEffect(() => {
    const sync = () => {
      const updated = calculatePosition();
      if (updated) setCoords(updated);
    };

    if (isVisible) {
      window.addEventListener('scroll', sync);
      window.addEventListener('resize', sync);
    }
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [isVisible]);

  if (!notes) return <>{children}</>;

  const popoverContent = isVisible && coords && (
    <>
      <div className="notes-popover-overlay" style={{ zIndex: 9998 }} />
      <div 
        className={`notes-popover-box notes-popover-box--${coords.direction} shadow-xl`}
        style={{ 
          position: 'absolute',
          top: `${coords.top + (coords.direction === 'bottom' ? 8 : 0)}px`,
          left: `${coords.left}px`,
          transform: coords.direction === 'top' ? 'translateY(-100%)' : 'none',
          zIndex: 9999
        }}
        onMouseEnter={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="notes-popover-header">
          {t('notes', 'הערות')}
        </div>
        <div className="notes-popover-content">
          {notes}
        </div>
        <div className="notes-popover-arrow" />
      </div>
    </>
  );

  return (
    <div 
      className="notes-popover-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      {isVisible && createPortal(popoverContent, document.body)}
    </div>
  );
};

export default NotesPopover;
