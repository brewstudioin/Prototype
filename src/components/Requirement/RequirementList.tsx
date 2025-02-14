import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Requirement } from '../../types';

interface RequirementListProps {
  requirements: Requirement[];
  onSelect: (requirement: Requirement) => void;
  onDelete: (requirementId: string, requirementName: string) => void;
  formatLastViewed: (timestamp: number) => string;
}

export const RequirementList: React.FC<RequirementListProps> = ({
  requirements,
  onSelect,
  onDelete,
  formatLastViewed,
}) => {
  const navigate = useNavigate();

  const handleSelect = (requirement: Requirement) => {
    onSelect(requirement); // Call the original onSelect to update lastViewed
    navigate(`/projects/${requirement.projectId}/requirements/analyze`, { state: { requirement } });
  };

  return (
    <div className="space-y-4">
      {requirements.map(requirement => (
        <div key={requirement.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSelect(requirement)}
                  className="text-lg font-semibold text-gray-900 hover:text-[#feb249] transition-colors"
                >
                  {requirement.name}
                </button>
                {requirement.hasDraft && (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>Created:</span>
                  <span>{formatLastViewed(requirement.createdAt)} by {requirement.createdBy}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <span>Last modified:</span>
                  <span>{formatLastViewed(requirement.lastViewed)} by {requirement.editedBy}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDelete(requirement.id, requirement.name)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`Delete ${requirement.name} requirement`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 