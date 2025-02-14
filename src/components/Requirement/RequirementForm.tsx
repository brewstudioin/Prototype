import React from 'react';
import { X } from 'lucide-react';
import type { RequirementForm as RequirementFormType } from '../../types';

interface RequirementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: () => void;
  form: RequirementFormType;
  onChange: (form: RequirementFormType) => void;
  isEditMode?: boolean;
}

export const RequirementForm: React.FC<RequirementFormProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  form,
  onChange,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-lg">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Requirement' : 'Analyse Requirements'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirement Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => onChange({ ...form, name: e.target.value })}
                  placeholder="Name of requirement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="valueStatement" className="block text-sm font-medium text-gray-700 mb-1">
                  Value Statement
                </label>
                <textarea
                  id="valueStatement"
                  value={form.valueStatement}
                  onChange={(e) => onChange({ ...form, valueStatement: e.target.value })}
                  placeholder="As a (intended user), I want to (intended action), so that (goal/outcome of action)."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-gray-700 mb-1">
                  Acceptance Criteria
                </label>
                <textarea
                  id="acceptanceCriteria"
                  value={form.acceptanceCriteria}
                  onChange={(e) => onChange({ ...form, acceptanceCriteria: e.target.value })}
                  placeholder="Scenario: (explain scenario). Given (how things begin/pre condition), when (action taken), then (outcome of taking action)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                />
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t">
            <button
              onClick={onAnalyze}
              className="w-full px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849] transition-colors"
            >
              {isEditMode ? 'Update & Analyse Requirement' : 'Analyse Requirement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 