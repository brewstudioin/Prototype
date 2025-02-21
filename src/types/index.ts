export interface Project {
  id: number;
  name: string;
  description: string;
  repositories: Repository[];
}

export interface Repository {
  name: string;
  branch: string;
  url: string;
}

export interface Requirement {
  id: string;
  projectId: number;
  name: string;
  valueStatement: string;
  acceptanceCriteria: string;
  lastViewed: number;
  editedBy: string;
  createdAt: number;
  createdBy: string;
  hasDraft: boolean;
  impactScore: number;
}

export interface AnalysisData {
  dependencies: {
    id: string;
    name: string;
  }[];
  risks: {
    id: string;
    description: string;
    severity: string;
    mitigation: string;
  }[];
  uiUxImpacts: {
    id: string;
    description: string;
  }[];
  codeImpacts: {
    id: string;
    description: string;
  }[];
  dataImpacts: {
    id: string;
    description: string;
  }[];
  executiveSummary: string;
}

export interface Action {
  id: string;
  type: string;
  item: string;
  action: 'edit' | 'ignore';
  timestamp: number;
  username: string;
  editedContent?: string;
  status?: string;
  completedAt?: number;
}

export interface SnackbarState {
  show: boolean;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface RequirementForm {
  name: string;
  valueStatement: string;
  acceptanceCriteria: string;
}

export interface ImpactAnalysis {
  dependencies: Dependency[];
  risks: Risk[];
  uiUxImpacts: Impact[];
  codeImpacts: Impact[];
  dataImpacts: Impact[];
  executiveSummary: string;
}

export interface Dependency {
  id: string;
  name: string;
  isManual?: boolean;
}

export interface Risk {
  id: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
  isManual?: boolean;
}

export interface Impact {
  id: string;
  description: string;
  editedContent?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  isManual?: boolean;
}

export interface ImpactAction {
  id: string;
  type: 'risk' | 'ui' | 'code' | 'data' | 'dependency' | 'requirement';
  item: string;
  action: 'edit' | 'ignore';
  timestamp: number;
  username: string;
  editedContent?: string;
  status?: 'accepted' | 'rejected' | 'added' | 'removed' | 'edited';
  completedAt?: number;
} 