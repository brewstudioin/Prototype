import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Brain, Network, FileCode, Database, X, Edit3, RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { RequirementForm, ImpactAnalysis, ImpactAction } from '../types';
import { DependenciesSection } from '../components/Impact/DependenciesSection';
import { RisksSection } from '../components/Impact/RisksSection';
import { ImpactColumn } from '../components/Impact/ImpactColumn';

interface LocationState {
  requirement: RequirementForm;
}

export const ImpactAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requirement } = location.state as LocationState;

  // Mock analysis data for demonstration
  const analysis: ImpactAnalysis = {
    dependencies: [
      { id: 'd1', name: 'Authentication Service' },
      { id: 'd2', name: 'Payment Gateway' }
    ],
    risks: [
      { 
        id: 'r1', 
        description: 'High load during peak hours', 
        severity: 'High',
        mitigation: 'Implement fallback authentication'
      },
      { 
        id: 'r2', 
        description: 'Data consistency across services', 
        severity: 'Medium',
        mitigation: 'Add retry mechanism'
      }
    ],
    uiUxImpacts: [
      { id: 'ui1', description: 'New user flow needed for payment process' },
      { id: 'ui2', description: 'Mobile responsiveness updates required' }
    ],
    codeImpacts: [
      { id: 'c1', description: 'API endpoint modifications needed' },
      { id: 'c2', description: 'New middleware for request validation' }
    ],
    dataImpacts: [
      { id: 'd1', description: 'New schema for user preferences' },
      { id: 'd2', description: 'Database migration required' }
    ],
    executiveSummary: 'This requirement introduces significant changes to the payment processing workflow, affecting multiple system components. Key considerations include security implications and user experience improvements.'
  };

  const [showImpactDetails, setShowImpactDetails] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showReviewChangesSlider, setShowReviewChangesSlider] = useState(false);
  const [actions, setActions] = useState<ImpactAction[]>([]);
  const [completedActions, setCompletedActions] = useState<ImpactAction[]>([]);
  const [editingMitigationId, setEditingMitigationId] = useState<string | null>(null);
  const [editedMitigationContent, setEditedMitigationContent] = useState('');
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [editedImpactContent, setEditedImpactContent] = useState('');

  const handleAction = (id: string, type: 'risk' | 'ui' | 'code' | 'data', item: string, action: 'edit' | 'ignore') => {
    const newAction: ImpactAction = {
      id,
      type,
      item,
      action,
      timestamp: Date.now(),
      username: 'Current User', // TODO: Get from auth context
    };
    setActions(prev => [newAction, ...prev]);
    
    if (action === 'edit') {
      if (type === 'risk') {
        setEditingMitigationId(id);
        setEditedMitigationContent(item);
      } else {
        setEditingImpactId(id);
        setEditedImpactContent(item);
      }
    }
  };

  const handleSubmitMitigationEdit = (riskId: string) => {
    setActions(prev => prev.map(action => 
      action.id === riskId 
        ? { ...action, editedContent: editedMitigationContent }
        : action
    ));
    setEditingMitigationId(null);
    setEditedMitigationContent('');
  };

  const handleDiscardEdit = (id: string) => {
    setEditingMitigationId(null);
    setEditedMitigationContent('');
    setEditingImpactId(null);
    setEditedImpactContent('');
    setActions(prev => prev.filter(action => action.id !== id));
  };

  const handleSubmitImpactEdit = (impactId: string) => {
    setActions(prev => prev.map(action => 
      action.id === impactId 
        ? { ...action, editedContent: editedImpactContent }
        : action
    ));
    setEditingImpactId(null);
    setEditedImpactContent('');
  };

  const handleAcceptChange = (action: ImpactAction) => {
    setCompletedActions(prev => [{
      ...action,
      status: 'accepted',
      completedAt: Date.now()
    }, ...prev]);
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  const handleRejectChange = (action: ImpactAction) => {
    setCompletedActions(prev => [{
      ...action,
      status: 'rejected',
      completedAt: Date.now()
    }, ...prev]);
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  const handleAcceptAllChanges = () => {
    const acceptedActions: ImpactAction[] = actions.map(action => ({
      ...action,
      status: 'accepted' as const,
      completedAt: Date.now()
    }));
    
    setCompletedActions(prev => [...acceptedActions, ...prev]);
    setActions([]);
    setShowReviewChangesSlider(false);
  };

  const handleUndoAllActions = () => {
    setActions([]);
    setEditingMitigationId(null);
    setEditedMitigationContent('');
    setEditingImpactId(null);
    setEditedImpactContent('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Impact Analysis</h1>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowReviewChangesSlider(true)}
                disabled={actions.length === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  actions.length > 0 
                    ? 'text-white bg-[#feb249] hover:bg-[#fea849]' 
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                Review Changes
                {actions.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-white text-[#feb249] rounded-full">
                    {actions.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Requirement Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {requirement.name || 'Untitled Requirement'}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Dependencies Section */}
        <DependenciesSection dependencies={analysis.dependencies} />

        {/* Risks Section */}
        <RisksSection
          risks={analysis.risks}
          actions={actions}
          editingMitigationId={editingMitigationId}
          editedMitigationContent={editedMitigationContent}
          onAction={handleAction}
          onSubmitMitigation={handleSubmitMitigationEdit}
          onDiscardEdit={handleDiscardEdit}
          onEditMitigationChange={setEditedMitigationContent}
        />

        {/* Impact Summary */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Summary</h2>
          <p className="text-gray-600">{analysis.executiveSummary}</p>
        </section>

        {/* Impact Columns */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <ImpactColumn
            title="UI/UX"
            icon={<Network className="w-5 h-5 text-[#feb249]" />}
            impacts={analysis.uiUxImpacts}
            actions={actions}
            editingImpactId={editingImpactId}
            editedImpactContent={editedImpactContent}
            impactType="ui"
            onAction={handleAction}
            onSubmitImpact={handleSubmitImpactEdit}
            onDiscardEdit={handleDiscardEdit}
            onEditImpactChange={setEditedImpactContent}
          />
          <ImpactColumn
            title="Code Source"
            icon={<FileCode className="w-5 h-5 text-[#feb249]" />}
            impacts={analysis.codeImpacts}
            actions={actions}
            editingImpactId={editingImpactId}
            editedImpactContent={editedImpactContent}
            impactType="code"
            onAction={handleAction}
            onSubmitImpact={handleSubmitImpactEdit}
            onDiscardEdit={handleDiscardEdit}
            onEditImpactChange={setEditedImpactContent}
          />
          <ImpactColumn
            title="Data Source"
            icon={<Database className="w-5 h-5 text-[#feb249]" />}
            impacts={analysis.dataImpacts}
            actions={actions}
            editingImpactId={editingImpactId}
            editedImpactContent={editedImpactContent}
            impactType="data"
            onAction={handleAction}
            onSubmitImpact={handleSubmitImpactEdit}
            onDiscardEdit={handleDiscardEdit}
            onEditImpactChange={setEditedImpactContent}
          />
        </div>

        {/* Activity Log */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <button 
            onClick={() => setShowActivityLog(!showActivityLog)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#feb249]" />
              <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            </div>
            {showActivityLog ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showActivityLog && (
            <div className="space-y-3">
              {/* Pending Actions */}
              {actions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Changes</h3>
                  {actions.map(action => (
                    <div key={action.timestamp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center gap-3">
                        {action.action === 'edit' ? (
                          <Edit3 className="w-4 h-4 text-[#feb249]" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-600">
                            {action.action === 'edit' ? 'Edited' : 'Ignored'} {action.type}: {action.item}
                          </span>
                          <span className="text-sm text-gray-400">
                            by {action.username} • {formatTimestamp(action.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Actions */}
              {completedActions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Changes</h3>
                  {completedActions.map(action => (
                    <div key={action.timestamp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center gap-3">
                        {action.status === 'accepted' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-600">
                            {action.status === 'accepted' ? 'Accepted' : 'Rejected'} {action.type}: {action.editedContent || action.item}
                          </span>
                          <span className="text-sm text-gray-400">
                            by {action.username} • {formatTimestamp(action.completedAt || action.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Review Changes Slider */}
      {showReviewChangesSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-lg">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Review Changes</h2>
                <button 
                  onClick={() => setShowReviewChangesSlider(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Requirement Name
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                        {requirement.name || 'Untitled Requirement'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value Statement
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[96px]">
                        {requirement.valueStatement || 'No value statement provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Acceptance Criteria
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[96px] space-y-3">
                        {requirement.acceptanceCriteria || 'No acceptance criteria provided'}
                        
                        {actions.length > 0 && (
                          <div className="border-t border-gray-200 mt-3 pt-3">
                            <div className="space-y-2">
                              {actions.map(action => (
                                <div key={action.timestamp} className="flex items-center justify-between p-2 bg-white rounded-md">
                                  <div className="flex items-center gap-2">
                                    {action.action === 'edit' ? (
                                      <Edit3 className="w-4 h-4 text-[#feb249]" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-500" />
                                    )}
                                    <div className="text-sm">
                                      <span className="text-gray-600">
                                        {action.type === 'risk' ? 'Risk Mitigation' :
                                         action.type === 'ui' ? 'UI/UX Impact' :
                                         action.type === 'code' ? 'Code Impact' : 'Data Impact'}:
                                      </span>
                                      {action.action === 'edit' && (
                                        <div className="mt-1 pl-4 text-gray-500">
                                          <div className="line-through">{action.item}</div>
                                          <div className="text-gray-900">{action.editedContent}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleAcceptChange(action)}
                                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                                    >
                                      <Check className="w-4 h-4" />
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRejectChange(action)}
                                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                      <X className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="p-6 border-t">
                <button
                  onClick={() => {
                    handleUndoAllActions();
                    setShowReviewChangesSlider(false);
                  }}
                  disabled={actions.length === 0}
                  className={`w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md mb-3 ${
                    actions.length === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Undo All Changes
                </button>
                <button
                  onClick={handleAcceptAllChanges}
                  disabled={actions.length === 0}
                  className={`w-full px-4 py-2 bg-[#feb249] text-white rounded-md ${
                    actions.length === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#fea849] transition-colors'
                  }`}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 