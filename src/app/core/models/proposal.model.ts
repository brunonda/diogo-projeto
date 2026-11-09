export interface ProposalData {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  description: string;
  lgpdConsent?: boolean;
  honeypot?: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
  createdAt?: unknown;
  status?: string;
}
