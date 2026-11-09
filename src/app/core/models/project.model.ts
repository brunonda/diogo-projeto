export interface ProjectPhoto {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description?: string;
  coverUrl: string;
  photos: ProjectPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectType: string;
  budgetRange: string;
  description: string;
  lgpdConsent: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  timestamp: string;
}
