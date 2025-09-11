import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'select';
  options?: string[];
  className?: string;
  placeholder?: string;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onSave,
  type = 'text',
  options = [],
  className = '',
  placeholder = 'Enter value...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`group flex items-center space-x-2 ${className}`}>
        <span className="text-gray-900 dark:text-gray-100">{value}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
          aria-label="Edit"
          title="Click to edit"
        >
          <FiEdit2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {type === 'select' ? (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
          autoFocus
          title="Edit Option"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus
        />
      )}
      
      <div className="flex space-x-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isLoading}
          className="p-1 rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          aria-label="Save"
          title="Save changes"
        >
          <FiCheck size={14} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          disabled={isLoading}
          className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Cancel"
          title="Cancel editing"
        >
          <FiX size={14} />
        </motion.button>
      </div>
      
      {isLoading && (
        <div className="w-4 h-4">
          <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};
