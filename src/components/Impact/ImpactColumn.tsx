import React, { useState } from 'react';
import { Check, X, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Impact, ImpactAction } from '../../types';
import { CitationPopup } from './CitationPopup';

interface ImpactColumnProps {
  title: string;
  icon: React.ReactNode;
  impacts: Impact[];
  actions: ImpactAction[];
  editingImpactId: string | null;
  editedImpactContent: string;
  impactType: 'ui' | 'code' | 'data';
  onAction: (id: string, type: 'ui' | 'code' | 'data', item: string, action: 'edit' | 'ignore') => void;
  onSubmitImpact: (impactId: string) => void;
  onDiscardEdit: (impactId: string) => void;
  onEditImpactChange: (content: string) => void;
  onRemove?: (id: string) => void;
  completedActions: ImpactAction[];
  getCitationNumber: (itemId: string) => number;
}

export const ImpactColumn: React.FC<ImpactColumnProps> = ({
  title,
  icon,
  impacts,
  actions,
  editingImpactId,
  editedImpactContent,
  impactType,
  onAction,
  onSubmitImpact,
  onDiscardEdit,
  onEditImpactChange,
  onRemove,
  completedActions,
  getCitationNumber,
}) => {
  const [selectedImpact, setSelectedImpact] = useState<Impact | null>(null);

  // Filter rejected impacts for this type
  const rejectedImpacts = completedActions.filter(
    action => action.type === impactType && action.status === 'rejected'
  );

  // Check if an impact has been accepted
  const isImpactAccepted = (impactId: string) => {
    return completedActions.some(
      action => action.id === impactId && action.status === 'accepted'
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      
      {/* Current Impacts */}
      <div className="space-y-4">
        {impacts.map(impact => {
          const impactAction = actions.find(action => action.id === impact.id);
          const accepted = isImpactAccepted(impact.id);
          
          return (
            <div key={impact.id} className={`p-4 ${accepted ? 'bg-green-50' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between mb-3">
                {editingImpactId === impact.id ? (
                  <textarea
                    value={editedImpactContent}
                    onChange={(e) => onEditImpactChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                    rows={2}
                  />
                ) : (
                  <div className="flex-1">
                    <p className="text-gray-600">
                      {impactAction?.editedContent || impact.description}
                      <sup 
                        className="text-xs ml-1 text-[#feb249] cursor-pointer hover:text-[#fea849]"
                        onClick={() => setSelectedImpact(impact)}
                      >
                        [{getCitationNumber(impact.id)}]
                      </sup>
                    </p>
                  </div>
                )}
                {impact.isManual && onRemove && !editingImpactId && !accepted && (
                  <button
                    onClick={() => onRemove(impact.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    title="Remove impact"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!accepted && (
                <div className="flex gap-2">
                  {!impactAction ? (
                    <>
                      <button
                        onClick={() => onAction(impact.id, impactType, impact.description, 'edit')}
                        className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                      >
                        Edit Impact
                      </button>
                      <button
                        onClick={() => onAction(impact.id, impactType, impact.description, 'ignore')}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Ignore
                      </button>
                    </>
                  ) : editingImpactId === impact.id ? (
                    <>
                      <button
                        onClick={() => onSubmitImpact(impact.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                      >
                        <Check className="w-4 h-4" />
                        Submit
                      </button>
                      <button
                        onClick={() => onDiscardEdit(impact.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <X className="w-4 h-4" />
                        Discard
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onDiscardEdit(impact.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Undo
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rejected Impacts */}
      {rejectedImpacts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-medium">Rejected Changes</h3>
          </div>
          <div className="space-y-3">
            {rejectedImpacts.map(action => (
              <div key={action.timestamp} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-gray-600">
                      {action.editedContent || action.item}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Rejected by {action.username} • {new Date(action.completedAt || action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onAction(action.id, impactType, action.item, 'edit')}
                  className="text-sm text-[#feb249] hover:text-[#fea849]"
                >
                  Reconsider Change
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citation Popup */}
      {selectedImpact && (
        <CitationPopup
          item={selectedImpact}
          citationNumber={getCitationNumber(selectedImpact.id)}
          onClose={() => setSelectedImpact(null)}
        />
      )}
    </section>
  );
}; 