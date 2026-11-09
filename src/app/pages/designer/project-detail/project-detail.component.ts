import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project, ProjectPhoto } from '../../../core/models/project.model';

@Component({
  selector: 'app-designer-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './project-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  readonly project = signal<Project | null>(null);
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');

  // Formulário de Nova Foto
  readonly newPhotoUrl = signal<string>('');
  readonly newPhotoCaption = signal<string>('');
  readonly isPostingPhoto = signal<boolean>(false);

  // Edição básica de título/descrição do projeto
  readonly isEditingProject = signal<boolean>(false);
  readonly editTitle = signal<string>('');
  readonly editCategory = signal<string>('');
  readonly editDescription = signal<string>('');

  // Exemplos rápidos de URLs de fotos para facilitar testes do designer
  readonly sampleImages = [
    { label: 'Living com Sofá', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Cozinha Planejada', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Banheiro Spa', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Home Office Madeira', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Suíte Contemporânea', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/designer']);
      return;
    }

    this.loadProject(id);
  }

  loadProject(id: string): void {
    const p = this.projectService.getProjectById(id);
    if (!p) {
      this.errorMessage.set('Projeto não encontrado.');
      return;
    }
    this.project.set(p);
  }

  useSampleImage(url: string, label: string): void {
    this.newPhotoUrl.set(url);
    if (!this.newPhotoCaption()) {
      this.newPhotoCaption.set(label);
    }
  }

  async handleAddPhoto(): Promise<void> {
    const p = this.project();
    if (!p) return;

    const url = this.newPhotoUrl().trim();
    if (!url) {
      this.errorMessage.set('Informe a URL da imagem a ser postada.');
      return;
    }

    this.isPostingPhoto.set(true);
    this.errorMessage.set('');

    try {
      await this.projectService.addPhotoToProject(p.id, {
        url,
        caption: this.newPhotoCaption().trim()
      });

      this.newPhotoUrl.set('');
      this.newPhotoCaption.set('');
      this.successMessage.set('Nova foto publicada no projeto com sucesso!');
      setTimeout(() => this.successMessage.set(''), 3000);

      this.loadProject(p.id);
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Erro ao publicar foto.');
    } finally {
      this.isPostingPhoto.set(false);
    }
  }

  async handleDeletePhoto(photoId: string): Promise<void> {
    const p = this.project();
    if (!p) return;

    if (confirm('Tem certeza de que deseja remover esta foto do projeto?')) {
      await this.projectService.deletePhotoFromProject(p.id, photoId);
      this.successMessage.set('Foto removida.');
      setTimeout(() => this.successMessage.set(''), 3000);
      this.loadProject(p.id);
    }
  }

  async handleSetCover(photoUrl: string): Promise<void> {
    const p = this.project();
    if (!p) return;

    await this.projectService.setCoverPhoto(p.id, photoUrl);
    this.successMessage.set('Capa do projeto atualizada!');
    setTimeout(() => this.successMessage.set(''), 3000);
    this.loadProject(p.id);
  }

  openEditProject(): void {
    const p = this.project();
    if (!p) return;
    this.editTitle.set(p.title);
    this.editCategory.set(p.category);
    this.editDescription.set(p.description || '');
    this.isEditingProject.set(true);
  }

  closeEditProject(): void {
    this.isEditingProject.set(false);
  }

  async saveEditProject(): Promise<void> {
    const p = this.project();
    if (!p) return;

    await this.projectService.updateProject(p.id, {
      title: this.editTitle().trim(),
      category: this.editCategory().trim(),
      description: this.editDescription().trim()
    });

    this.closeEditProject();
    this.loadProject(p.id);
    this.successMessage.set('Informações do projeto atualizadas.');
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}
