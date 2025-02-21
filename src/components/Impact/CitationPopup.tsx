import React from 'react';
import { X } from 'lucide-react';
import type { Risk, Impact } from '../../types';

interface CitationPopupProps {
  item: Risk | Impact;
  citationNumber: number;
  onClose: () => void;
}

export const CitationPopup: React.FC<CitationPopupProps> = ({
  item,
  citationNumber,
  onClose,
}) => {
  const isRisk = 'severity' in item;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Citation [{citationNumber}]
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isRisk ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Risk Description</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    item.severity === 'High' ? 'bg-red-100 text-red-700' :
                    item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.severity}
                  </span>
                  <p className="text-gray-900">{item.description}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Mitigation Strategy</h3>
                <p className="text-gray-600">{item.mitigation}</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Impact Description</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}; 