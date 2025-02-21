import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, MessageSquareMore } from 'lucide-react';

interface EmptyRequirementsProps {
  onAnalyze: () => void;
}

export const EmptyRequirements: React.FC<EmptyRequirementsProps> = ({
  onAnalyze,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <div className="grid grid-cols-2 gap-6">
      <button 
        onClick={() => navigate(`/projects/${projectId}/chat`)}
        className="relative group bg-white rounded-lg shadow-sm p-6 border-2 border-transparent hover:border-gray-200 transition-colors"
      >
        <div className="flex flex-col items-center text-center">
          <MessageSquareMore className="w-12 h-12 text-gray-400 mb-4 group-hover:text-gray-600 transition-colors" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ask Brewer</h2>
          <p className="text-gray-500">Get instant answers about your project from our AI assistant</p>
        </div>
      </button>

      <button 
        onClick={onAnalyze}
        className="relative group bg-white rounded-lg shadow-sm p-6 border-2 border-[#feb249]"
      >
        <div className="absolute -top-3 -right-3 bg-[#feb249] text-white text-xs px-3 py-1 rounded-full">
          Recommended
        </div>
        <div className="flex flex-col items-center text-center">
          <Brain className="w-12 h-12 text-[#feb249] mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyse Requirements</h2>
          <p className="text-gray-500">Let our AI analyze your project requirements and suggest improvements</p>
        </div>
      </button>
    </div>
  );
}; 