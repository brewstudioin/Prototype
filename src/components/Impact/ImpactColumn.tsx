import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import type { Impact, ImpactAction } from '../../types';

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
}) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {impacts.map(impact => {
          const impactAction = actions.find(action => action.id === impact.id);
          
          return (
            <div key={impact.id} className="p-4 bg-gray-50 rounded-lg">
              {editingImpactId === impact.id ? (
                <textarea
                  value={editedImpactContent}
                  onChange={(e) => onEditImpactChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent mb-3"
                  rows={2}
                />
              ) : (
                <p className="text-gray-600 mb-3">
                  {impactAction?.editedContent || impact.description}
                </p>
              )}
              <div className="flex gap-2">
                {!impactAction ? (
                  <>
                    <button
                      onClick={() => onAction(impact.id, impactType, impact.description, 'edit')}
                      className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                    >
                      Edit Requirement
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
            </div>
          );
        })}
      </div>
    </section>
  );
}; 