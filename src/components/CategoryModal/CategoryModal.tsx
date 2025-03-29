import React, { useState } from 'react';
import './CategoryModal.scss';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (categoryName: string) => Promise<void>;
  existingCategories: string[];
  isLoading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCategories,
  isLoading = false,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    if (existingCategories.includes(categoryName.toLowerCase())) {
      setError('This category already exists');
      return;
    }

    try {
      await onAdd(categoryName);
      setCategoryName('');
    } catch (err) {
      setError('Failed to add category. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="category-modal-overlay">
      <div className="category-modal">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name:</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              disabled={isLoading}
            />
            {error && <p className="error">{error}</p>}
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal; 