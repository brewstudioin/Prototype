import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Brain, Network, FileCode, Database, X, Edit3, RotateCcw, Check, ChevronDown, ChevronUp, Plus } from 'lucide-react';
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
  const [analysis, setAnalysis] = useState<ImpactAnalysis>({
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
  });

  const [showImpactDetails, setShowImpactDetails] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showReviewChangesSlider, setShowReviewChangesSlider] = useState(false);
  const [showRequirementSlider, setShowRequirementSlider] = useState(false);
  const [editedRequirement, setEditedRequirement] = useState<RequirementForm | null>(null);
  const [actions, setActions] = useState<ImpactAction[]>([]);
  const [completedActions, setCompletedActions] = useState<ImpactAction[]>([]);
  const [editingMitigationId, setEditingMitigationId] = useState<string | null>(null);
  const [editedMitigationContent, setEditedMitigationContent] = useState('');
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [editedImpactContent, setEditedImpactContent] = useState('');
  const [showAddToRequirementSlider, setShowAddToRequirementSlider] = useState(false);
  const [newImpactText, setNewImpactText] = useState('');
  const [selectedImpactType, setSelectedImpactType] = useState<string>('');
  const [selectedImpactSubtype, setSelectedImpactSubtype] = useState<string>('');
  const [mitigationText, setMitigationText] = useState('');

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

  const handleAddToRequirement = () => {
    setShowAddToRequirementSlider(true);
  };

  const handleSubmitNewImpact = () => {
    if (newImpactText.trim()) {
      const timestamp = Date.now();
      const newId = `${selectedImpactType}-${timestamp}`;

      // Create a new action for the activity log
      const newAction: ImpactAction = {
        id: newId,
        type: selectedImpactType === 'impact' ? (selectedImpactSubtype as 'ui' | 'code' | 'data') : 'risk',
        item: newImpactText.trim(),
        action: 'edit',
        timestamp,
        username: 'Current User', // TODO: Get from auth context
        status: 'added',
        completedAt: timestamp
      };

      if (selectedImpactType === 'dependency') {
        setAnalysis(prev => ({
          ...prev,
          dependencies: [
            { 
              id: newId, 
              name: newImpactText.trim(),
              isManual: true 
            },
            ...prev.dependencies
          ]
        }));
      } else if (selectedImpactType === 'risk') {
        setAnalysis(prev => ({
          ...prev,
          risks: [
            {
              id: newId,
              description: newImpactText.trim(),
              severity: 'Medium', // Default severity
              mitigation: mitigationText.trim(),
              isManual: true
            },
            ...prev.risks
          ]
        }));
      } else if (selectedImpactType === 'impact') {
        const impact = { 
          id: newId, 
          description: newImpactText.trim(),
          isManual: true 
        };
        
        setAnalysis(prev => ({
          ...prev,
          ...(selectedImpactSubtype === 'ui' && {
            uiUxImpacts: [impact, ...prev.uiUxImpacts]
          }),
          ...(selectedImpactSubtype === 'code' && {
            codeImpacts: [impact, ...prev.codeImpacts]
          }),
          ...(selectedImpactSubtype === 'data' && {
            dataImpacts: [impact, ...prev.dataImpacts]
          })
        }));
      }

      // Add to completed actions
      setCompletedActions(prev => [newAction, ...prev]);

      // Reset form
      setNewImpactText('');
      setMitigationText('');
      setSelectedImpactType('');
      setSelectedImpactSubtype('');
      setShowAddToRequirementSlider(false);
    }
  };

  const handleRemoveDependency = (id: string) => {
    setAnalysis(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(dep => dep.id !== id)
    }));

    // Add to completed actions as a removal
    const removedDep = analysis.dependencies.find(dep => dep.id === id);
    if (removedDep) {
      setCompletedActions(prev => [{
        id,
        type: 'dependency',
        item: removedDep.name,
        action: 'edit',
        timestamp: Date.now(),
        username: 'Current User', // TODO: Get from auth context
        status: 'removed',
        completedAt: Date.now()
      }, ...prev]);
    }
  };

  const handleRemoveRisk = (id: string) => {
    setAnalysis(prev => ({
      ...prev,
      risks: prev.risks.filter(risk => risk.id !== id)
    }));

    // Add to completed actions as a removal
    const removedRisk = analysis.risks.find(risk => risk.id === id);
    if (removedRisk) {
      setCompletedActions(prev => [{
        id,
        type: 'risk',
        item: removedRisk.description,
        action: 'edit',
        timestamp: Date.now(),
        username: 'Current User', // TODO: Get from auth context
        status: 'removed',
        completedAt: Date.now()
      }, ...prev]);
    }
  };

  const handleRemoveImpact = (id: string, type: 'ui' | 'code' | 'data') => {
    setAnalysis(prev => ({
      ...prev,
      ...(type === 'ui' && {
        uiUxImpacts: prev.uiUxImpacts.filter(impact => impact.id !== id)
      }),
      ...(type === 'code' && {
        codeImpacts: prev.codeImpacts.filter(impact => impact.id !== id)
      }),
      ...(type === 'data' && {
        dataImpacts: prev.dataImpacts.filter(impact => impact.id !== id)
      })
    }));

    // Add to completed actions as a removal
    const impactArray = type === 'ui' ? analysis.uiUxImpacts :
                       type === 'code' ? analysis.codeImpacts :
                       analysis.dataImpacts;
    const removedImpact = impactArray.find(impact => impact.id === id);
    if (removedImpact) {
      setCompletedActions(prev => [{
        id,
        type,
        item: removedImpact.description,
        action: 'edit',
        timestamp: Date.now(),
        username: 'Current User', // TODO: Get from auth context
        status: 'removed',
        completedAt: Date.now()
      }, ...prev]);
    }
  };

  const handleEditRequirement = () => {
    setEditedRequirement(requirement);
    setShowRequirementSlider(true);
  };

  const handleUpdateRequirement = () => {
    if (editedRequirement) {
      // TODO: Add API call to update requirement
      const timestamp = Date.now();
      setCompletedActions(prev => [{
        id: `req-${timestamp}`,
        type: 'requirement',
        item: requirement.name,
        action: 'edit',
        timestamp,
        username: 'Current User', // TODO: Get from auth context
        status: 'edited',
        editedContent: editedRequirement.name,
        completedAt: timestamp
      }, ...prev]);

      // Update the requirement in location state
      const newState = {
        ...location.state,
        requirement: editedRequirement
      };
      navigate(location.pathname, { state: newState, replace: true });
    }
    setShowRequirementSlider(false);
    setEditedRequirement(null);
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
              <button
                onClick={handleAddToRequirement}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#feb249] bg-white border border-[#feb249] rounded-md hover:bg-[#fff5e6]"
              >
                <Plus className="w-4 h-4" />
                Add to Requirement
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Add to Requirement Slider */}
      {showAddToRequirementSlider && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-lg z-50">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add Additional Impact</h2>
              <button 
                onClick={() => {
                  setShowAddToRequirementSlider(false);
                  setNewImpactText('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Current Requirement Details */}
              <div className="p-6 border-b">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirement Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                      {requirement.name || 'Untitled Requirement'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value Statement
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[96px]">
                      {requirement.valueStatement || 'No value statement provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acceptance Criteria
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[96px]">
                      {requirement.acceptanceCriteria || 'No acceptance criteria provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* New Impact Input */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Category
                    </label>
                    <select
                      value={selectedImpactType}
                      onChange={(e) => {
                        setSelectedImpactType(e.target.value);
                        setSelectedImpactSubtype(''); // Reset subtype when main type changes
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent bg-white"
                    >
                      <option value="">Select a category</option>
                      <option value="risk">Risk</option>
                      <option value="impact">Impact</option>
                      <option value="dependency">Dependency</option>
                    </select>
                  </div>

                  {selectedImpactType === 'impact' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Impact Type
                      </label>
                      <select
                        value={selectedImpactSubtype}
                        onChange={(e) => setSelectedImpactSubtype(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent bg-white"
                      >
                        <option value="">Select impact type</option>
                        <option value="ui">UI/UX</option>
                        <option value="code">Code Source</option>
                        <option value="data">Data Source</option>
                      </select>
                    </div>
                  )}

                  {((selectedImpactType === 'impact' && selectedImpactSubtype) || 
                    (selectedImpactType && selectedImpactType !== 'impact')) && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedImpactType === 'risk' ? 'Describe Risk' :
                           selectedImpactType === 'dependency' ? 'Describe Dependency' :
                           selectedImpactSubtype === 'ui' ? 'Describe UI/UX Impact' :
                           selectedImpactSubtype === 'code' ? 'Describe Code Impact' :
                           'Describe Data Impact'}
                        </label>
                        <textarea
                          value={newImpactText}
                          onChange={(e) => setNewImpactText(e.target.value)}
                          placeholder={
                            selectedImpactType === 'risk' ? 'Describe the potential risk and its implications...' :
                            selectedImpactType === 'dependency' ? 'Describe the dependency and its requirements...' :
                            selectedImpactSubtype === 'ui' ? 'Describe the UI/UX changes needed...' :
                            selectedImpactSubtype === 'code' ? 'Describe the code changes required...' :
                            'Describe the data source modifications needed...'
                          }
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                        />
                      </div>

                      {selectedImpactType === 'risk' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Risk Mitigation
                          </label>
                          <textarea
                            value={mitigationText}
                            onChange={(e) => setMitigationText(e.target.value)}
                            placeholder="Describe how this risk can be mitigated..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t">
                <button
                  onClick={handleSubmitNewImpact}
                  disabled={!selectedImpactType || 
                           (selectedImpactType === 'impact' && !selectedImpactSubtype) || 
                           !newImpactText.trim() ||
                           (selectedImpactType === 'risk' && !mitigationText.trim())}
                  className={`w-full px-4 py-2 rounded-md transition-colors ${
                    (selectedImpactType && 
                     (selectedImpactType !== 'impact' || selectedImpactSubtype) && 
                     newImpactText.trim() &&
                     (selectedImpactType !== 'risk' || mitigationText.trim()))
                      ? 'bg-[#feb249] text-white hover:bg-[#fea849]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add {selectedImpactType === 'impact' 
                    ? (selectedImpactSubtype === 'ui' ? 'UI/UX Impact' :
                       selectedImpactSubtype === 'code' ? 'Code Impact' :
                       selectedImpactSubtype === 'data' ? 'Data Impact' : 'Impact')
                    : selectedImpactType.charAt(0).toUpperCase() + selectedImpactType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <button
                  onClick={handleEditRequirement}
                  className="p-1 text-gray-400 hover:text-[#feb249] rounded-full hover:bg-[#fff5e6]"
                  title="Edit requirement"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600">{requirement.valueStatement}</p>
            </div>
          </div>
        </section>

        {/* Dependencies Section */}
        <DependenciesSection 
          dependencies={analysis.dependencies} 
          onRemove={handleRemoveDependency}
        />

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
          onRemove={handleRemoveRisk}
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
            onRemove={(id) => handleRemoveImpact(id, 'ui')}
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
            onRemove={(id) => handleRemoveImpact(id, 'code')}
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
            onRemove={(id) => handleRemoveImpact(id, 'data')}
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
                        {action.status === 'added' ? (
                          <Plus className="w-4 h-4 text-[#feb249]" />
                        ) : action.status === 'removed' ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : action.status === 'accepted' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-600">
                            {action.status === 'added' ? 'Added new' :
                             action.status === 'removed' ? 'Removed' :
                             action.status === 'accepted' ? 'Accepted' : 'Rejected'} {action.type}: {action.editedContent || action.item}
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

      {/* Requirement Slider */}
      {showRequirementSlider && editedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-lg">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Edit Requirement</h2>
                <button 
                  onClick={() => {
                    setShowRequirementSlider(false);
                    setEditedRequirement(null);
                  }}
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
                      <input
                        type="text"
                        value={editedRequirement.name}
                        onChange={(e) => setEditedRequirement({
                          ...editedRequirement,
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value Statement
                      </label>
                      <textarea
                        value={editedRequirement.valueStatement}
                        onChange={(e) => setEditedRequirement({
                          ...editedRequirement,
                          valueStatement: e.target.value
                        })}
                        placeholder="Enter the value statement"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Acceptance Criteria
                      </label>
                      <textarea
                        value={editedRequirement.acceptanceCriteria}
                        onChange={(e) => setEditedRequirement({
                          ...editedRequirement,
                          acceptanceCriteria: e.target.value
                        })}
                        placeholder="Enter the acceptance criteria"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      />
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="p-6 border-t">
                <button
                  onClick={handleUpdateRequirement}
                  disabled={!editedRequirement.name.trim() || 
                           !editedRequirement.valueStatement.trim() || 
                           !editedRequirement.acceptanceCriteria.trim()}
                  className={`w-full px-4 py-2 bg-[#feb249] text-white rounded-md ${
                    (!editedRequirement.name.trim() || 
                     !editedRequirement.valueStatement.trim() || 
                     !editedRequirement.acceptanceCriteria.trim())
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#fea849] transition-colors'
                  }`}
                >
                  Update Requirement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 