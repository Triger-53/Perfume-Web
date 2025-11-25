
import React, { ReactNode, useState, useEffect } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match duration of animation
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-lg transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold font-serif">{title}</h2>
          <button onClick={handleClose} className="text-2xl font-bold text-gray-500 hover:text-black">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
