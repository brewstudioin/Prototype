import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import type { Risk, ImpactAction } from '../../types';

interface RisksSectionProps {
  risks: Risk[];
  actions: ImpactAction[];
  editingMitigationId: string | null;
  editedMitigationContent: string;
  onAction: (id: string, type: 'risk', item: string, action: 'edit' | 'ignore') => void;
  onSubmitMitigation: (riskId: string) => void;
  onDiscardEdit: (riskId: string) => void;
  onEditMitigationChange: (content: string) => void;
  onRemove?: (id: string) => void;
}

export const RisksSection: React.FC<RisksSectionProps> = ({
  risks,
  actions,
  editingMitigationId,
  editedMitigationContent,
  onAction,
  onSubmitMitigation,
  onDiscardEdit,
  onEditMitigationChange,
  onRemove,
}) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Risks & Mitigations</h2>
      <div className="space-y-6">
        {risks.map(risk => {
          const riskAction = actions.find(action => action.id === risk.id);
          
          return (
            <div key={risk.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">
                    {risk.description}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ml-2 ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-800' :
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.severity} Risk
                  </span>
                </div>
                {risk.isManual && onRemove && (
                  <button
                    onClick={() => onRemove(risk.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    title="Remove risk"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Mitigation:</span>
                  {editingMitigationId === risk.id ? (
                    <textarea
                      value={editedMitigationContent}
                      onChange={(e) => onEditMitigationChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      rows={2}
                    />
                  ) : (
                    <span>{riskAction?.editedContent || risk.mitigation}</span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  {!riskAction ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAction(risk.id, 'risk', risk.mitigation, 'edit')}
                        className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                      >
                        Edit Requirement
                      </button>
                      <button
                        onClick={() => onAction(risk.id, 'risk', risk.mitigation, 'ignore')}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Ignore
                      </button>
                    </div>
                  ) : editingMitigationId === risk.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSubmitMitigation(risk.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                      >
                        <Check className="w-4 h-4" />
                        Submit
                      </button>
                      <button
                        onClick={() => onDiscardEdit(risk.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <X className="w-4 h-4" />
                        Discard
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDiscardEdit(risk.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Undo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}; 