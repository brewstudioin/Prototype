import React from 'react';
import type { Dependency } from '../../types';

interface DependenciesSectionProps {
  dependencies: Dependency[];
}

export const DependenciesSection: React.FC<DependenciesSectionProps> = ({ dependencies }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Dependencies</h2>
      <div className="space-y-4">
        {dependencies.map(dep => (
          <div key={dep.id} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">{dep.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}; 