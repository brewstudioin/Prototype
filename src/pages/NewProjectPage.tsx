import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, FolderGit2, Github } from 'lucide-react';

interface NewProjectForm {
  name: string;
  description: string;
}

interface NewProjectPageProps {
  onCreateProject: (project: NewProjectForm) => void;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({ onCreateProject }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    name: '',
    description: ''
  });

  const handleCreateProject = () => {
    onCreateProject(newProjectForm);
    navigate('/projects');
  };

  return (
    <>
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
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#feb249] focus:ring-[#feb249] focus:ring-opacity-50" 
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="description"
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
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
                onClick={handleCreateProject}
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
    </>
  );
}; 