import React from 'react';
import './Modal.scss';

interface ModalProps {
  show: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2>{title}</h2>
          {onClose ? <button onClick={onClose} className="modal__close-button">&times;</button> : null}
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
