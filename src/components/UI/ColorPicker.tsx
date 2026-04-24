import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { type StatusColor } from '../../types';

interface ColorPickerProps {
  value: StatusColor;
  onChange: (color: StatusColor) => void;
}

const COLORS: StatusColor[] = ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'pink', 'teal'];

const COLOR_HEX_MAP: Record<StatusColor, string> = {
  gray: '#6B7280',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6'
};

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<StatusColor | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const hoverTimeoutRef = useRef<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const pickerHeight = 170; // Estimated height including padding and gap
      const spaceBelow = viewportHeight - rect.bottom;
      
      let top;
      if (spaceBelow < pickerHeight + 20) {
        // Open above if there's no space below
        top = rect.top + window.scrollY - 160; // Picker height is roughly 152px
      } else {
        // Open below
        top = rect.bottom + window.scrollY + 8;
      }

      setCoords({
        top,
        left: rect.right + window.scrollX - 160,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node) && 
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      updateCoords();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateCoords);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  const handleMouseEnter = (color: StatusColor) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => setHoveredColor(color), 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setHoveredColor(null);
  };

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          border: `2px solid ${isOpen ? 'var(--color-tertiary)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen ? '0 0 0 3px var(--color-tertiary-alpha, rgba(13, 148, 136, 0.2))' : 'none',
        }}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: COLOR_HEX_MAP[value || 'gray'] }} />
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            padding: '12px',
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            zIndex: 10000,
            minWidth: '140px',
            animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              onMouseEnter={() => handleMouseEnter(color)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: COLOR_HEX_MAP[color],
                border: `3px solid ${value === color ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: value === color ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {hoveredColor === color && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-surface)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10001,
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {t(`color_${color}`, color)}
                </div>
              )}
              {value === color && (
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-surface)', borderRadius: '50%' }} />
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ColorPicker;
