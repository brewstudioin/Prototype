import React from 'react';
import { X } from 'lucide-react';
import type { Dependency } from '../../types';

interface DependenciesSectionProps {
  dependencies: Dependency[];
  onRemove?: (id: string) => void;
}

export const DependenciesSection: React.FC<DependenciesSectionProps> = ({ dependencies, onRemove }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Dependencies</h2>
      <div className="space-y-4">
        {dependencies.map(dep => (
          <div key={dep.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{dep.name}</h3>
              {dep.isManual && onRemove && (
                <button
                  onClick={() => onRemove(dep.id)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  title="Remove dependency"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}; 