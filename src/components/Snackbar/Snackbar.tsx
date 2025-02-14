import React from 'react';
import { SnackbarState } from '../../types';

export interface SnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  snackbar,
  onClose
}) => {
  if (!snackbar.show) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
      <span>{snackbar.message}</span>
      <div className="flex items-center gap-3">
        {snackbar.action && (
          <button
            onClick={snackbar.action.onClick}
            className="text-[#feb249] hover:text-[#fea849] font-medium"
          >
            {snackbar.action.label}
          </button>
        )}
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}; 