import React, { useState } from 'react';
import { Plus, Github, FolderGit2, ArrowRight, ArrowLeft, GitBranch, ExternalLink, Star, ChevronDown, ChevronUp, Brain, MessageSquareMore, Network, FileCode, Database, X, Edit3, RotateCcw, Trash2, Check } from 'lucide-react';

// Mock projects data
const mockProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "A modern e-commerce solution with advanced features",
    repositories: [
      {
        name: "frontend-web",
        branch: "main",
        url: "https://github.com/example/frontend-web"
      },
      {
        name: "backend-api",
        branch: "main",
        url: "https://github.com/example/backend-api"
      }
    ]
  },
  {
    id: 2,
    name: "Analytics Dashboard",
    description: "Real-time analytics and reporting dashboard",
    repositories: [
      {
        name: "analytics-dashboard",
        branch: "main",
        url: "https://github.com/example/analytics-dashboard"
      }
    ]
  }
];

// Mock analysis data
const mockAnalysisData = {
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

interface SnackbarState {
  show: boolean;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Action {
  id: string;
  type: string;
  item: string;
  action: 'edit' | 'ignore';
  timestamp: number;
  username: string;
  editedContent?: string;
}

function App() {
  const [step, setStep] = useState(1);
  const [showProjects, setShowProjects] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showAnalyzeSlider, setShowAnalyzeSlider] = useState(false);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [requirementForm, setRequirementForm] = useState({
    name: '',
    valueStatement: '',
    acceptanceCriteria: ''
  });
  const [actions, setActions] = useState<Action[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ show: false, message: '' });
  const [pendingDeleteRepo, setPendingDeleteRepo] = useState<{ projectId: number; repoName: string } | null>(null);
  const [showEditRequirementSlider, setShowEditRequirementSlider] = useState(false);
  const [editingMitigationId, setEditingMitigationId] = useState<string | null>(null);
  const [editedMitigationContent, setEditedMitigationContent] = useState('');
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [editedImpactContent, setEditedImpactContent] = useState('');
  const [showReviewChangesSlider, setShowReviewChangesSlider] = useState(false);

  const currentUser = {
    username: 'John Doe'
  };

  const toggleExpanded = (projectId: number) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleFavorite = (projectId: number) => {
    setFavorites(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleAction = (id: string, type: string, item: string, action: 'edit' | 'ignore') => {
    const newAction = {
      id,
      type,
      item,
      action,
      timestamp: Date.now(),
      username: currentUser.username
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

  const handleDiscardEdit = (riskId: string) => {
    setEditingMitigationId(null);
    setEditedMitigationContent('');
    setActions(prev => prev.filter(action => action.id !== riskId));
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

  const handleAddToRequirement = () => {
    setIsEditMode(true);
    setShowAnalysisResults(false);
    setShowAnalyzeSlider(true);
  };

  const handleAnalyzeRequirement = () => {
    setShowAnalyzeSlider(false);
    setShowAnalysisResults(true);
  };

  const handleDeleteRepo = (projectId: number, repoName: string) => {
    setPendingDeleteRepo({ projectId, repoName });
    setSnackbar({
      show: true,
      message: `Delete repository "${repoName}"?`,
      action: {
        label: 'Delete',
        onClick: () => {
          const updatedProjects = mockProjects.map(project => {
            if (project.id === projectId) {
              return {
                ...project,
                repositories: project.repositories.filter(repo => repo.name !== repoName)
              };
            }
            return project;
          });
          setPendingDeleteRepo(null);
          setSnackbar({ show: false, message: '' });
        }
      }
    });
  };

  const handleDeleteProject = (projectId: number, projectName: string) => {
    setSnackbar({
      show: true,
      message: `Delete project "${projectName}"?`,
      action: {
        label: 'Delete',
        onClick: () => {
          const updatedProjects = mockProjects.filter(project => project.id !== projectId);
          setSnackbar({ show: false, message: '' });
        }
      }
    });
  };

  const handleEditRequirement = () => {
    setShowEditRequirementSlider(true);
  };

  const handleUndoAllActions = () => {
    setActions([]);
    setEditingMitigationId(null);
    setEditedMitigationContent('');
    setEditingImpactId(null);
    setEditedImpactContent('');
  };

  const handleAcceptChange = (action: Action) => {
    const changeDescription = `\n\nImpact: ${
      action.type === 'risk' ? 'Risk Mitigation' :
      action.type === 'ui' ? 'UI/UX Impact' :
      action.type === 'code' ? 'Code Impact' : 'Data Impact'
    }\n${action.editedContent || action.item}`;

    setRequirementForm(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria 
        ? `${prev.acceptanceCriteria}${changeDescription}`
        : changeDescription.trim()
    }));

    setActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
  };

  const handleAcceptAllChanges = () => {
    // Process all actions and add them to acceptance criteria
    actions.forEach(action => {
      const changeDescription = `\n\nImpact: ${
        action.type === 'risk' ? 'Risk Mitigation' :
        action.type === 'ui' ? 'UI/UX Impact' :
        action.type === 'code' ? 'Code Impact' : 'Data Impact'
      }\n${action.editedContent || action.item}`;

      setRequirementForm(prev => ({
        ...prev,
        acceptanceCriteria: prev.acceptanceCriteria 
          ? `${prev.acceptanceCriteria}${changeDescription}`
          : changeDescription.trim()
      }));
    });

    // Clear all actions
    setActions([]);
    // Close the slider
    setShowReviewChangesSlider(false);
  };

  if (showAnalysisResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowAnalysisResults(false);
                    setShowEditRequirementSlider(true);
                  }}
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
                  className="px-4 py-2 text-sm font-medium text-white bg-[#feb249] rounded-md hover:bg-[#fea849]"
                >
                  Review Changes
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  View on Graph
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Requirement Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {requirementForm.name || 'Untitled Requirement'}
                </h2>
              </div>
              <button
                onClick={handleEditRequirement}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#feb249] hover:bg-[#fff5e6] rounded-md"
              >
                <Edit3 className="w-4 h-4" />
                Edit Requirement
              </button>
            </div>
          </section>

          {/* Edit Requirement Slider */}
          {showEditRequirementSlider && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-lg">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Requirement</h2>
                    <button 
                      onClick={() => setShowEditRequirementSlider(false)}
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
                          value={requirementForm.name}
                          onChange={(e) => setRequirementForm(prev => ({ ...prev, name: e.target.value }))}
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
                          value={requirementForm.valueStatement}
                          onChange={(e) => setRequirementForm(prev => ({ ...prev, valueStatement: e.target.value }))}
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
                          value={requirementForm.acceptanceCriteria}
                          onChange={(e) => setRequirementForm(prev => ({ ...prev, acceptanceCriteria: e.target.value }))}
                          placeholder="Scenario: (explain scenario). Given (how things begin/pre condition), when (action taken), then (outcome of taking action)"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                        />
                      </div>
                    </form>
                  </div>
                  
                  <div className="p-6 border-t">
                    <button
                      onClick={() => setShowEditRequirementSlider(false)}
                      className="w-full px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                            {requirementForm.name || 'Untitled Requirement'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Value Statement
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[96px]">
                            {requirementForm.valueStatement || 'No value statement provided'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Acceptance Criteria
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[96px] space-y-3">
                            {requirementForm.acceptanceCriteria || 'No acceptance criteria provided'}
                            
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
                                          onClick={() => {/* TODO: Handle reject */}}
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
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 mb-3"
                    >
                      Undo All Changes
                    </button>
                    <button
                      onClick={handleAcceptAllChanges}
                      className="w-full px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849] transition-colors"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dependencies Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dependencies</h2>
            <div className="space-y-4">
              {mockAnalysisData.dependencies.map(dep => (
                <div key={dep.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">{dep.name}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Risks Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risks & Mitigations</h2>
            <div className="space-y-6">
              {mockAnalysisData.risks.map(risk => {
                const riskAction = actions.find(action => action.id === risk.id);
                
                return (
                  <div key={risk.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="flex items-center p-4">
                      <h3 className="font-medium text-gray-900">
                        {risk.description}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1  ml-2 ${
                        risk.severity === 'High' ? 'bg-red-100 text-red-800' :
                        risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.severity} Risk
                      </span>
                    </div>
                    <div className="border-t border-gray-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Mitigation:</span>
                        {editingMitigationId === risk.id ? (
                          <textarea
                            value={editedMitigationContent}
                            onChange={(e) => setEditedMitigationContent(e.target.value)}
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
                              onClick={() => handleAction(risk.id, 'risk', risk.mitigation, 'edit')}
                              className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                            >
                              Edit Requirement
                            </button>
                            <button
                              onClick={() => handleAction(risk.id, 'risk', risk.mitigation, 'ignore')}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              Ignore
                            </button>
                          </div>
                        ) : editingMitigationId === risk.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmitMitigationEdit(risk.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                            >
                              <Check className="w-4 h-4" />
                              Submit
                            </button>
                            <button
                              onClick={() => handleDiscardEdit(risk.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <X className="w-4 h-4" />
                              Discard
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDiscardEdit(risk.id)}
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

          {/* Impact Summary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Summary</h2>
            <p className="text-gray-600">{mockAnalysisData.executiveSummary}</p>
          </section>

          {/* Impact Columns */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* UI/UX Impacts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-[#feb249]" />
                <h2 className="text-lg font-semibold text-gray-900">UI/UX</h2>
              </div>
              <div className="space-y-4">
                {mockAnalysisData.uiUxImpacts.map(impact => {
                  const impactAction = actions.find(action => action.id === impact.id);
                  
                  return (
                    <div key={impact.id} className="p-4 bg-gray-50 rounded-lg">
                      {editingImpactId === impact.id ? (
                        <textarea
                          value={editedImpactContent}
                          onChange={(e) => setEditedImpactContent(e.target.value)}
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
                              onClick={() => handleAction(impact.id, 'ui', impact.description, 'edit')}
                              className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                            >
                              Edit Requirement
                            </button>
                            <button
                              onClick={() => handleAction(impact.id, 'ui', impact.description, 'ignore')}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              Ignore
                            </button>
                          </>
                        ) : editingImpactId === impact.id ? (
                          <>
                            <button
                              onClick={() => handleSubmitImpactEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                            >
                              <Check className="w-4 h-4" />
                              Submit
                            </button>
                            <button
                              onClick={() => handleDiscardEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <X className="w-4 h-4" />
                              Discard
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDiscardEdit(impact.id)}
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

            {/* Code Source Impacts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="w-5 h-5 text-[#feb249]" />
                <h2 className="text-lg font-semibold text-gray-900">Code Source</h2>
              </div>
              <div className="space-y-4">
                {mockAnalysisData.codeImpacts.map(impact => {
                  const impactAction = actions.find(action => action.id === impact.id);
                  
                  return (
                    <div key={impact.id} className="p-4 bg-gray-50 rounded-lg">
                      {editingImpactId === impact.id ? (
                        <textarea
                          value={editedImpactContent}
                          onChange={(e) => setEditedImpactContent(e.target.value)}
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
                              onClick={() => handleAction(impact.id, 'code', impact.description, 'edit')}
                              className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                            >
                              Edit Requirement
                            </button>
                            <button
                              onClick={() => handleAction(impact.id, 'code', impact.description, 'ignore')}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              Ignore
                            </button>
                          </>
                        ) : editingImpactId === impact.id ? (
                          <>
                            <button
                              onClick={() => handleSubmitImpactEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                            >
                              <Check className="w-4 h-4" />
                              Submit
                            </button>
                            <button
                              onClick={() => handleDiscardEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <X className="w-4 h-4" />
                              Discard
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDiscardEdit(impact.id)}
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

            {/* Data Source Impacts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#feb249]" />
                <h2 className="text-lg font-semibold text-gray-900">Data Source</h2>
              </div>
              <div className="space-y-4">
                {mockAnalysisData.dataImpacts.map(impact => {
                  const impactAction = actions.find(action => action.id === impact.id);
                  
                  return (
                    <div key={impact.id} className="p-4 bg-gray-50 rounded-lg">
                      {editingImpactId === impact.id ? (
                        <textarea
                          value={editedImpactContent}
                          onChange={(e) => setEditedImpactContent(e.target.value)}
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
                              onClick={() => handleAction(impact.id, 'data', impact.description, 'edit')}
                              className="px-3 py-1 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                            >
                              Edit Requirement
                            </button>
                            <button
                              onClick={() => handleAction(impact.id, 'data', impact.description, 'ignore')}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              Ignore
                            </button>
                          </>
                        ) : editingImpactId === impact.id ? (
                          <>
                            <button
                              onClick={() => handleSubmitImpactEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                            >
                              <Check className="w-4 h-4" />
                              Submit
                            </button>
                            <button
                              onClick={() => handleDiscardEdit(impact.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <X className="w-4 h-4" />
                              Discard
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDiscardEdit(impact.id)}
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
          </div>

          {/* Recent Actions */}
          {actions.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#feb249]" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Actions</h2>
                </div>
                <button
                  onClick={handleUndoAllActions}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  Undo All
                </button>
              </div>
              <div className="space-y-3">
                {actions.map(action => (
                  <div key={action.timestamp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                          by {action.username} • {
                            new Date(action.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  if (selectedProject !== null) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-semibold text-gray-900">BrewHQ</div>
            <nav className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Documentation</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Support</button>
            </nav>
          </div>
        </header>

        {/* Dashboard */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-6">
            <button className="relative group bg-white rounded-lg shadow-sm p-6 border-2 border-transparent hover:border-gray-200 transition-colors">
              <div className="flex flex-col items-center text-center">
                <MessageSquareMore className="w-12 h-12 text-gray-400 mb-4 group-hover:text-gray-600 transition-colors" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ask Brewer</h2>
                <p className="text-gray-500">Get instant answers about your project from our AI assistant</p>
              </div>
            </button>

            <button 
              onClick={() => setShowAnalyzeSlider(true)}
              className="relative group bg-white rounded-lg shadow-sm p-6 border-2 border-[#feb249]"
            >
              <div className="absolute -top-3 -right-3 bg-[#feb249] text-white text-xs px-3 py-1 rounded-full">
                Recommended
              </div>
              <div className="flex flex-col items-center text-center">
                <Brain className="w-12 h-12 text-[#feb249] mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyse Requirements</h2>
                <p className="text-gray-500">Let our AI analyze your project requirements and suggest improvements</p>
              </div>
            </button>
          </div>
        </main>

        {/* Analyze Requirements Slider */}
        {showAnalyzeSlider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-lg">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditMode ? 'Edit Requirement' : 'Analyse Requirements'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowAnalyzeSlider(false);
                      setIsEditMode(false);
                    }}
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
                        value={requirementForm.name}
                        onChange={(e) => setRequirementForm(prev => ({ ...prev, name: e.target.value }))}
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
                        value={requirementForm.valueStatement}
                        onChange={(e) => setRequirementForm(prev => ({ ...prev, valueStatement: e.target.value }))}
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
                        value={requirementForm.acceptanceCriteria}
                        onChange={(e) => setRequirementForm(prev => ({ ...prev, acceptanceCriteria: e.target.value }))}
                        placeholder="Scenario: (explain scenario). Given (how things begin/pre condition), when (action taken), then (outcome of taking action)"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                      />
                    </div>
                  </form>
                </div>
                
                <div className="p-6 border-t">
                  <button
                    onClick={handleAnalyzeRequirement}
                    className="w-full px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849] transition-colors"
                  >
                    {isEditMode ? 'Update & Analyse Requirement' : 'Analyse Requirement'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showProjects) {
    const snackbarJSX = snackbar.show && (
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
            onClick={() => {
              setPendingDeleteRepo(null);
              setSnackbar({ show: false, message: '' });
            }}
            className="text-gray-300 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-semibold text-gray-900">BrewHQ</div>
            <nav className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Documentation</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Support</button>
            </nav>
          </div>
        </header>

        {/* Projects List */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
            <button 
              onClick={() => setShowProjects(false)}
              className="flex items-center gap-2 px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849]"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          <div className="space-y-4">
            {mockProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleFavorite(project.id)}
                      className={`text-gray-400 hover:text-gray-600 ${favorites.includes(project.id) ? 'text-[#feb249]' : ''}`}
                    >
                      <Star className="w-5 h-5" fill={favorites.includes(project.id) ? "#feb249" : "none"} />
                    </button>
                    <div>
                      <button 
                        onClick={() => setSelectedProject(project.id)}
                        className="text-lg font-semibold text-gray-900 hover:text-[#feb249] transition-colors"
                      >
                        {project.name}
                      </button>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${project.name} project`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleExpanded(project.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedProjects.includes(project.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedProjects.includes(project.id) && (
                  <div className="border-t px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Connected Repositories</h3>
                      <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#feb249] hover:bg-[#fff5e6] rounded-md"
                        onClick={() => {/* TODO: Implement add repo functionality */}}
                      >
                        <Plus className="w-4 h-4" />
                        New Repository
                      </button>
                    </div>
                    <div className="space-y-3">
                      {project.repositories.map(repo => (
                        <div key={repo.name} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md">
                          <div className="flex items-center gap-3">
                            <Github className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900 font-medium">{repo.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <GitBranch className="w-4 h-4" />
                              {repo.branch}
                            </div>
                            <a 
                              href={repo.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#feb249] hover:text-[#fea849]"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteRepo(project.id, repo.name)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label={`Delete ${repo.name} repository`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
        {snackbarJSX}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">BrewHQ</div>
          <nav className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Documentation</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Support</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BrewHQ</h1>
          <p className="text-gray-600">Let's get started with your new project</p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-[#feb249] text-white' : 'bg-gray-200 text-gray-700'}`}>1</div>
            <div className="w-16 h-0.5 bg-gray-200" />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-[#feb249] text-white' : 'bg-gray-200 text-gray-700'}`}>2</div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={step === 1 ? 'text-[#feb249] font-medium' : ''}>Create Project</span>
            <span className={step === 2 ? 'text-[#feb249] font-medium' : ''}>Connect Repository</span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Create Project */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <Plus className="w-10 h-10 text-[#feb249] mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Create New Project</h2>
                <p className="text-sm text-gray-500 text-center">Set up your project details</p>
              </div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#feb249] focus:ring-[#feb249] focus:ring-opacity-50" 
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    id="description" 
                    rows={3} 
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#feb249] focus:ring-[#feb249] focus:ring-opacity-50" 
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#fea849] text-white rounded-md hover:bg-[#fea849] transition-colors"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Step 2: Connect Repository */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <FolderGit2 className="w-10 h-10 text-[#feb249] mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Connect Repository</h2>
                <p className="text-sm text-gray-500 text-center">Link your project to a Github repository</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowProjects(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>Connect with Github</span>
                </button>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back to project details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;