import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutes } from './routes';
import { Project, Requirement, RequirementForm as RequirementFormType } from './types';

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

function App() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  const currentUser = {
    username: 'John Doe'
  };

  const routes = createRoutes({
    projects,
    requirements,
    onDeleteProject: (projectId: number, projectName: string) => {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    },
    onDeleteRepo: (projectId: number, repoName: string) => {
      setProjects(prev => prev.map(project => 
        project.id === projectId
          ? {
              ...project,
              repositories: project.repositories.filter(repo => repo.name !== repoName)
            }
          : project
      ));
    },
    onCreateProject: (newProject: { name: string; description: string }) => {
      setProjects(prev => [...prev, {
        id: prev.length + 1,
        ...newProject,
        repositories: []
      }]);
    },
    onDeleteRequirement: (requirementId: string, requirementName: string) => {
      console.log('Deleting requirement:', requirementId, requirementName);
      setRequirements(prev => prev.filter(req => req.id !== requirementId));
    },
    onSelectRequirement: (requirement: Requirement) => {
      setRequirements(prev => prev.map(req => 
        req.id === requirement.id
          ? { ...req, lastViewed: Date.now() }
          : req
      ));
    },
    onCreateRequirement: (requirementForm: RequirementFormType, projectId: number) => {
      const newRequirement: Requirement = {
        id: Date.now().toString(),
        projectId: projectId,
        name: requirementForm.name,
        valueStatement: requirementForm.valueStatement,
        acceptanceCriteria: requirementForm.acceptanceCriteria,
        lastViewed: Date.now(),
        editedBy: currentUser.username,
        createdAt: Date.now(),
        createdBy: currentUser.username,
        hasDraft: true,
        impactScore: Math.floor(Math.random() * 5) + 1  // Random score between 1-5 for demo
      };
      setRequirements(prev => [...prev, newRequirement]);
    }
  });

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App; 