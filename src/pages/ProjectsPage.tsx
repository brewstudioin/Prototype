import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, ChevronUp, ChevronDown, Github, GitBranch, ExternalLink, Trash2 } from 'lucide-react';
import { Project, SnackbarState } from '../types';
import { Snackbar } from '../components/Snackbar';

interface ProjectsPageProps {
  projects: Project[];
  onDeleteProject: (projectId: number, projectName: string) => void;
  onDeleteRepo: (projectId: number, repoName: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onDeleteProject,
  onDeleteRepo,
}) => {
  const navigate = useNavigate();
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ show: false, message: '' });
  const [pendingDeleteRepo, setPendingDeleteRepo] = useState<{ projectId: number; repoName: string } | null>(null);

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

  const handleDeleteRepo = (projectId: number, repoName: string) => {
    setPendingDeleteRepo({ projectId, repoName });
    setSnackbar({
      show: true,
      message: `Delete repository "${repoName}"?`,
      action: {
        label: 'Delete',
        onClick: () => {
          onDeleteRepo(projectId, repoName);
          setPendingDeleteRepo(null);
          setSnackbar({ show: false, message: '' });
        }
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
        <button 
          onClick={() => navigate('/new-project')}
          className="flex items-center gap-2 px-4 py-2 bg-[#feb249] text-white rounded-md hover:bg-[#fea849]"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map(project => (
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
                    onClick={() => navigate(`/projects/${project.id}/requirements`)}
                    className="text-lg font-semibold text-gray-900 hover:text-[#feb249] transition-colors"
                  >
                    {project.name}
                  </button>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onDeleteProject(project.id, project.name)}
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

      <Snackbar 
        snackbar={snackbar} 
        onClose={() => {
          setPendingDeleteRepo(null);
          setSnackbar({ show: false, message: '' });
        }} 
      />
    </>
  );
}; 