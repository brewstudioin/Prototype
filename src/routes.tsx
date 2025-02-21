import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { RequirementListPage } from './pages/RequirementListPage';
import { Project, Requirement, RequirementForm as RequirementFormType, ImpactAnalysis } from './types';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { ChatPage } from './pages/ChatPage';

interface RouteProps {
  projects: Project[];
  requirements: Requirement[];
  onDeleteProject: (projectId: number, projectName: string) => void;
  onDeleteRepo: (projectId: number, repoName: string) => void;
  onCreateProject: (project: { name: string; description: string }) => void;
  onDeleteRequirement: (requirementId: string, requirementName: string) => void;
  onSelectRequirement: (requirement: Requirement) => void;
  onCreateRequirement: (requirement: RequirementFormType, projectId: number) => void;
}

const createRoutes = (props: RouteProps): RouteObject[] => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProjectsPage 
          projects={props.projects} 
          onDeleteProject={props.onDeleteProject} 
          onDeleteRepo={props.onDeleteRepo} 
        />,
      },
      {
        path: 'projects',
        element: <ProjectsPage 
          projects={props.projects} 
          onDeleteProject={props.onDeleteProject} 
          onDeleteRepo={props.onDeleteRepo} 
        />,
      },
      {
        path: 'projects/:projectId/requirements',
        element: <RequirementListPage 
          projects={props.projects}
          requirements={props.requirements}
          onDeleteRequirement={props.onDeleteRequirement}
          onSelectRequirement={props.onSelectRequirement}
          onCreateRequirement={props.onCreateRequirement}
        />,
      },
      {
        path: 'projects/:projectId/chat',
        element: <ChatPage />,
      },
      {
        path: 'new-project',
        element: <NewProjectPage onCreateProject={props.onCreateProject} />,
      },
      {
        path: 'projects/:projectId/requirements/analyze',
        element: <ImpactAnalysisPage />,
      },
    ],
  },
];

export { createRoutes, type RouteProps }; 