import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, ProjectPhoto, ProjectRequest } from '../models/project.model';
import { ProposalData } from '../models/proposal.model';
import { EmailService } from './email.service';
import { AuditService } from './audit.service';

const STORAGE_PROJECTS = 'estudio_projects';
const STORAGE_PROPOSALS = 'estudio_proposals';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly emailService = inject(EmailService);
  private readonly auditService = inject(AuditService);

  readonly projectsSignal = signal<Project[]>([]);
  readonly proposalsSignal = signal<ProjectRequest[]>([]);

  constructor() {
    this.seedInitialDataIfEmpty();
    this.loadState();
  }

  private loadState(): void {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE_PROJECTS) || '[]');
      const r = JSON.parse(localStorage.getItem(STORAGE_PROPOSALS) || '[]');
      this.projectsSignal.set(p);
      this.proposalsSignal.set(r);
    } catch {
      this.projectsSignal.set([]);
      this.proposalsSignal.set([]);
    }
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projects));
    this.projectsSignal.set(projects);
  }

  private saveProposals(proposals: ProjectRequest[]): void {
    localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(proposals));
    this.proposalsSignal.set(proposals);
  }

  // ==========================================
  // SEED DE DADOS INICIAIS DO PORTFÓLIO
  // ==========================================
  private seedInitialDataIfEmpty(): void {
    const stored = localStorage.getItem(STORAGE_PROJECTS);
    if (!stored || JSON.parse(stored).length === 0 || !JSON.parse(stored)[0]?.photos) {
      const initialProjects: Project[] = [
        {
          id: 'proj-001',
          title: 'Living Contemporâneo',
          category: 'Residencial',
          description: 'Projeto de living integrado com mobiliário sob medida, paleta neutra e iluminação cenográfica pontual.',
          coverUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
          photos: [
            {
              id: 'photo-101',
              url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
              caption: 'Vista ampla do living com sofá modular em linho e painel amadeirado ripado',
              createdAt: '2026-08-10T14:00:00Z'
            },
            {
              id: 'photo-102',
              url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
              caption: 'Detalhe da iluminação indireta e integração com sala de jantar',
              createdAt: '2026-08-12T10:15:00Z'
            },
            {
              id: 'photo-103',
              url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
              caption: 'Canto de leitura com poltrona assinada e mesa de apoio em mármore',
              createdAt: '2026-08-15T16:30:00Z'
            }
          ],
          createdAt: '2026-08-01T10:00:00Z',
          updatedAt: '2026-08-15T16:30:00Z'
        },
        {
          id: 'proj-002',
          title: 'Cozinha Minimalista',
          category: 'Residencial',
          description: 'Cozinha funcional com ilha central em quartzo branco, marcenaria sem puxadores e eletrodomésticos embutidos.',
          coverUrl: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1200',
          photos: [
            {
              id: 'photo-201',
              url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1200',
              caption: 'Ilha central em iluminação linear embutida e bancada de apoio',
              createdAt: '2026-09-02T11:00:00Z'
            },
            {
              id: 'photo-202',
              url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200',
              caption: 'Armários em laca fosca e nicho para torre quente',
              createdAt: '2026-09-05T14:40:00Z'
            }
          ],
          createdAt: '2026-09-01T09:00:00Z',
          updatedAt: '2026-09-05T14:40:00Z'
        },
        {
          id: 'proj-003',
          title: 'Estúdio Criativo & Home Office',
          category: 'Comercial / Home Office',
          description: 'Ambiente planejado para produtividade com luz natural abundante, marcenaria acústica e ergonomia de ponta.',
          coverUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
          photos: [
            {
              id: 'photo-301',
              url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
              caption: 'Mesa de trabalho em carvalho americano e estante decorativa',
              createdAt: '2026-09-20T15:20:00Z'
            },
            {
              id: 'photo-302',
              url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
              caption: 'Vista lateral com painéis acústicos e luminária articulada',
              createdAt: '2026-09-22T17:00:00Z'
            }
          ],
          createdAt: '2026-09-15T08:00:00Z',
          updatedAt: '2026-09-22T17:00:00Z'
        },
        {
          id: 'proj-004',
          title: 'Suíte Master',
          category: 'Residencial',
          description: 'Suíte com cabeceira estofada do chão ao teto, closet integrado e banheiro spa em travertino.',
          coverUrl: 'https://images.unsplash.com/photo-1522771731478-44eb10e5c290?auto=format&fit=crop&q=80&w=1200',
          photos: [
            {
              id: 'photo-401',
              url: 'https://images.unsplash.com/photo-1522771731478-44eb10e5c290?auto=format&fit=crop&q=80&w=1200',
              caption: 'Cama king-size com enxoval em algodão egípcio e arandelas com dimmer',
              createdAt: '2026-10-01T12:00:00Z'
            },
            {
              id: 'photo-402',
              url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
              caption: 'Banheiro privativo em mármore travertino com cuba dupla esculpida',
              createdAt: '2026-10-03T16:00:00Z'
            }
          ],
          createdAt: '2026-10-01T10:00:00Z',
          updatedAt: '2026-10-03T16:00:00Z'
        }
      ];
      this.saveProjects(initialProjects);
    }
  }

  // ==========================================
  // OPERAÇÕES DE PROJETOS DO DESIGNER
  // ==========================================
  getProjects(): Observable<Project[]> {
    return of(this.projectsSignal());
  }

  getAllProjects(): Project[] {
    return this.projectsSignal();
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }

  async addProject(data: { title: string; category: string; description?: string; coverUrl: string }): Promise<Project> {
    const newProject: Project = {
      id: 'proj-' + Date.now(),
      title: data.title.trim(),
      category: data.category.trim(),
      description: data.description?.trim() || '',
      coverUrl: data.coverUrl.trim(),
      photos: [
        {
          id: 'photo-' + Date.now(),
          url: data.coverUrl.trim(),
          caption: 'Foto principal do projeto',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const list = [newProject, ...this.projectsSignal()];
    this.saveProjects(list);
    await this.auditService.log('ADD_PROJECT', 'PROJECT', newProject.id, 'designer', `Criou novo projeto: ${newProject.title}`);
    return newProject;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    const list = this.projectsSignal();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated: Project = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    this.saveProjects([...list]);
    await this.auditService.log('UPDATE_PROJECT', 'PROJECT', id, 'designer', `Atualizou projeto: ${updated.title}`);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const list = this.projectsSignal().filter(p => p.id !== id);
    this.saveProjects(list);
    await this.auditService.log('DELETE_PROJECT', 'PROJECT', id, 'designer', `Excluiu projeto ID: ${id}`);
    return true;
  }

  // ==========================================
  // OPERAÇÕES DE FOTOS DO PROJETO
  // ==========================================
  async addPhotoToProject(projectId: string, photo: { url: string; caption?: string }): Promise<ProjectPhoto | null> {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const newPhoto: ProjectPhoto = {
      id: 'photo-' + Date.now(),
      url: photo.url.trim(),
      caption: photo.caption?.trim() || '',
      createdAt: new Date().toISOString()
    };

    const updatedPhotos = [newPhoto, ...project.photos];
    // Se o projeto não tinha foto de capa, define esta como capa
    const coverUrl = project.coverUrl || newPhoto.url;

    await this.updateProject(projectId, {
      photos: updatedPhotos,
      coverUrl
    });

    await this.auditService.log('ADD_PHOTO', 'PROJECT', projectId, 'designer', `Publicou nova foto no projeto ${project.title}`);
    return newPhoto;
  }

  async deletePhotoFromProject(projectId: string, photoId: string): Promise<boolean> {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const updatedPhotos = project.photos.filter(p => p.id !== photoId);
    let coverUrl = project.coverUrl;
    if (coverUrl === project.photos.find(p => p.id === photoId)?.url) {
      coverUrl = updatedPhotos[0]?.url || '';
    }

    await this.updateProject(projectId, {
      photos: updatedPhotos,
      coverUrl
    });

    await this.auditService.log('DELETE_PHOTO', 'PROJECT', projectId, 'designer', `Excluiu foto do projeto ${project.title}`);
    return true;
  }

  async setCoverPhoto(projectId: string, photoUrl: string): Promise<boolean> {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    await this.updateProject(projectId, {
      coverUrl: photoUrl
    });

    await this.auditService.log('SET_COVER', 'PROJECT', projectId, 'designer', `Atualizou capa do projeto ${project.title}`);
    return true;
  }

  // ==========================================
  // FORMULÁRIO DE BRIEFING PÚBLICO
  // ==========================================
  async submitProposal(proposalData: ProposalData): Promise<ProjectRequest> {
    const newProposal: ProjectRequest = {
      id: 'prop-' + Date.now(),
      clientName: proposalData.name.trim(),
      clientEmail: proposalData.email.toLowerCase().trim(),
      clientPhone: (proposalData.phone || '').trim(),
      projectType: proposalData.projectType,
      budgetRange: proposalData.budget,
      description: proposalData.description.trim(),
      lgpdConsent: !!proposalData.lgpdConsent,
      createdAt: new Date().toISOString()
    };

    const currentProposals = this.proposalsSignal();
    const updated = [newProposal, ...currentProposals];
    this.saveProposals(updated);

    await this.emailService.sendEmail({
      to: newProposal.clientEmail,
      subject: 'Confirmação de recebimento - Estúdio',
      body: `Olá ${newProposal.clientName},\n\nRecebemos sua mensagem com sucesso! O designer entrará em contato em breve.\n\nAtenciosamente,\nEstúdio de Design.`,
      type: 'confirmacao_proposta'
    });
    await this.auditService.log('CREATE_PROPOSAL', 'PROPOSAL', newProposal.id, newProposal.clientEmail, `Proposta enviada pelo visitante`);

    return newProposal;
  }
}
