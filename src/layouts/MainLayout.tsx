import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Navigation/Breadcrumbs';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const state = location.state as { requirement?: { name: string } } | undefined;

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];

    // Always start with Projects unless we're on the root
    if (pathSegments[0] !== 'new-project') {
      items.push({ label: 'Projects', path: '/projects' });
    }

    // Build the breadcrumb based on the path
    if (pathSegments.length > 0) {
      switch (pathSegments[0]) {
        case 'new-project':
          items.push({ label: 'New Project' });
          break;
        
        case 'projects':
          if (pathSegments.length > 1) {
            // Add project-specific breadcrumbs
            if (pathSegments[2] === 'requirements') {
              items.push({ label: 'Requirements', path: `/projects/${params.projectId}/requirements` });
              
              // Add analyze breadcrumb if we're on the analysis page
              if (pathSegments[3] === 'analyze') {
                items.push({ 
                  label: state?.requirement?.name || 'Impact Analysis',
                });
              }
            } else if (pathSegments[2] === 'chat') {
              items.push({ label: 'Chat' });
            }
          }
          break;
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">BrewHQ</div>
          <nav className="flex items-center gap-4">
            {/* Add navigation items here if needed */}
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumbs items={getBreadcrumbItems()} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}; 