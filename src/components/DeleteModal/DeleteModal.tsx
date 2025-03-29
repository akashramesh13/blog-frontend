import React from 'react';
import './DeleteModal.scss';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Delete Post</h2>
        <p>Are you sure you want to delete "{title}"?</p>
        <p className="warning">This action cannot be undone.</p>
        <div className="delete-modal__buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 