import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, MessageSquareMore, Plus, ArrowLeft, ChevronDown } from 'lucide-react';
import type { Project, SnackbarState, Requirement, RequirementForm as RequirementFormType } from '../types';
import { ProjectDropdown } from '../components/Project/ProjectDropdown';
import { RequirementList } from '../components/Requirement/RequirementList';
import { EmptyRequirements } from '../components/Requirement/EmptyRequirements';
import { Snackbar } from '../components/Snackbar/Snackbar';
import { RequirementForm } from '../components/Requirement/RequirementForm';

interface RequirementListPageProps {
  projects: Project[];
  requirements: Requirement[];
  onDeleteRequirement: (requirementId: string, requirementName: string) => void;
  onSelectRequirement: (requirement: Requirement) => void;
  onCreateRequirement: (requirement: RequirementFormType, projectId: number) => void;
}

export const RequirementListPage: React.FC<RequirementListPageProps> = ({
  projects,
  requirements,
  onDeleteRequirement,
  onSelectRequirement,
  onCreateRequirement,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ show: false, message: '' });
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [requirementForm, setRequirementForm] = useState<RequirementFormType>({
    name: '',
    valueStatement: '',
    acceptanceCriteria: ''
  });
  
  const currentProjectId = projectId ? parseInt(projectId) : null;
  const currentProject = projects?.find(p => p.id === currentProjectId);
  const currentProjectRequirements = requirements?.filter(req => req.projectId === currentProjectId) || [];

  const handleDeleteRequirement = (requirementId: string, requirementName: string) => {
    setSnackbar({
      show: true,
      message: `Delete requirement "${requirementName}"?`,
      action: {
        label: 'Delete',
        onClick: () => {
          onDeleteRequirement(requirementId, requirementName);
          setSnackbar({ show: false, message: '' });
        }
      }
    });
  };

  const handleAnalyzeClick = () => {
    setShowRequirementForm(true);
  };

  const handleAnalyzeSubmit = () => {
    if (requirementForm.name && currentProjectId) {
      onCreateRequirement(requirementForm, currentProjectId);
      setShowRequirementForm(false);
      setRequirementForm({
        name: '',
        valueStatement: '',
        acceptanceCriteria: ''
      });
      navigate(`/projects/${currentProjectId}/requirements/analyze`, {
        state: { requirement: requirementForm }
      });
    }
  };

  const formatLastViewed = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                aria-label="Go back to projects"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <ProjectDropdown
                projects={projects}
                selectedProject={currentProject}
                onSelectProject={(project) => navigate(`/projects/${project.id}/requirements`)}
                onNewProject={() => navigate('/new-project')}
                show={showProjectDropdown}
                onToggle={() => setShowProjectDropdown(!showProjectDropdown)}
              />
            </div>
            {currentProjectRequirements.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <MessageSquareMore className="w-4 h-4" />
                  Ask Brewer
                </button>
                <button
                  onClick={handleAnalyzeClick}
                  className="flex items-center gap-2 px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849]"
                >
                  <Brain className="w-4 h-4" />
                  Analyse Requirement
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentProjectRequirements.length === 0 ? (
          <EmptyRequirements onAnalyze={handleAnalyzeClick} />
        ) : (
          <RequirementList
            requirements={currentProjectRequirements}
            onSelect={onSelectRequirement}
            onDelete={handleDeleteRequirement}
            formatLastViewed={formatLastViewed}
          />
        )}
      </main>

      <RequirementForm
        isOpen={showRequirementForm}
        onClose={() => setShowRequirementForm(false)}
        onAnalyze={handleAnalyzeSubmit}
        form={requirementForm}
        onChange={setRequirementForm}
      />

      {snackbar.show && (
        <Snackbar
          snackbar={snackbar}
          onClose={() => setSnackbar({ show: false, message: '' })}
        />
      )}
    </div>
  );
}; 