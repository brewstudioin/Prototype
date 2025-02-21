import React, { useState } from 'react';
import { Check, X, RotateCcw, AlertTriangle, Brain } from 'lucide-react';
import type { Risk, ImpactAction } from '../../types';
import { CitationPopup } from './CitationPopup';

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
  completedActions: ImpactAction[];
  getCitationNumber: (itemId: string) => number;
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
  completedActions,
  getCitationNumber,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Filter rejected risks
  const rejectedRisks = completedActions.filter(
    action => action.type === 'risk' && action.status === 'rejected'
  );

  // Check if a risk has been accepted
  const isRiskAccepted = (riskId: string) => {
    return completedActions.some(
      action => action.id === riskId && action.status === 'accepted'
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-[#feb249]" />
        <h2 className="text-lg font-semibold text-gray-900">Risks & Mitigations</h2>
      </div>
      
      {/* Current Risks */}
      <div className="space-y-4">
        {risks.map(risk => {
          const riskAction = actions.find(action => action.id === risk.id);
          const accepted = isRiskAccepted(risk.id);
          
          return (
            <div key={risk.id} className={`p-4 ${accepted ? 'bg-green-50' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                      risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {risk.severity}
                    </span>
                    <h3 className="text-gray-900 font-medium">
                      {risk.description}
                      <sup 
                        className="text-xs ml-1 text-[#feb249] cursor-pointer hover:text-[#fea849]"
                        onClick={() => setSelectedRisk(risk)}
                      >
                        [{getCitationNumber(risk.id)}]
                      </sup>
                    </h3>
                  </div>
                  {editingMitigationId === risk.id ? (
                    <textarea
                      value={editedMitigationContent}
                      onChange={(e) => onEditMitigationChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-600">
                      {riskAction?.editedContent || risk.mitigation}
                    </p>
                  )}
                </div>
                {risk.isManual && onRemove && !editingMitigationId && !accepted && (
                  <button
                    onClick={() => onRemove(risk.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    title="Remove risk"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!accepted && (
                <div className="flex gap-2">
                  {!riskAction ? (
                    <>
                      <button
                        onClick={() => onAction(risk.id, 'risk', risk.mitigation, 'edit')}
                        className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                      >
                        Edit Risk
                      </button>
                      <button
                        onClick={() => onAction(risk.id, 'risk', risk.mitigation, 'ignore')}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Ignore
                      </button>
                    </>
                  ) : editingMitigationId === risk.id ? (
                    <>
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
                    </>
                  ) : (
                    <button
                      onClick={() => onDiscardEdit(risk.id)}
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

      {/* Rejected Risks */}
      {rejectedRisks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-medium">Rejected Mitigations</h3>
          </div>
          <div className="space-y-3">
            {rejectedRisks.map(action => {
              const risk = risks.find(r => r.id === action.id);
              if (!risk) return null;

              return (
                <div key={action.timestamp} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">
                        {risk.description}
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ml-2 ${
                          risk.severity === 'High' ? 'bg-red-100 text-red-800' :
                          risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {risk.severity} Risk
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Rejected Mitigation: {action.editedContent || action.item}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Rejected by {action.username} • {new Date(action.completedAt || action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAction(action.id, 'risk', action.item, 'edit')}
                    className="text-sm text-[#feb249] hover:text-[#fea849]"
                  >
                    Reconsider Change
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Citation Popup */}
      {selectedRisk && (
        <CitationPopup
          item={selectedRisk}
          citationNumber={getCitationNumber(selectedRisk.id)}
          onClose={() => setSelectedRisk(null)}
        />
      )}
    </section>
  );
}; 