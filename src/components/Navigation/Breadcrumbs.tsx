import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.path || item.label}>
            {item.path ? (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}; 