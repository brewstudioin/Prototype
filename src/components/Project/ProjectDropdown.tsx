import React, { useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectDropdownProps {
  projects: Project[];
  selectedProject: Project | undefined;
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  show: boolean;
  onToggle: () => void;
}

export const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  show,
  onToggle,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400"
      >
        <span>{selectedProject ? selectedProject.name : "Select Project"}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500">Connected Projects</div>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelectProject(project);
                  onToggle();
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedProject?.id === project.id ? 'bg-gray-50 text-[#feb249]' : 'text-gray-700'
                }`}
              >
                {project.name}
              </button>
            ))}
            <div className="border-t my-1"></div>
            <button
              onClick={() => {
                onNewProject();
                onToggle();
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#feb249] hover:bg-gray-100 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 