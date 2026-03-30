import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, size = 'md', children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div 
        className={`modal-content modal-content--${size}`} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-content__header">
          {title && <h2>{title}</h2>}
          <button className="modal-content__close" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="modal-content__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
