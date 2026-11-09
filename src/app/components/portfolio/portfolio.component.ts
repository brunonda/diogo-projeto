import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectPhoto } from '../../core/models/project.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent {
  private readonly projectService = inject(ProjectService);

  readonly allProjects = this.projectService.projectsSignal;
  readonly selectedCategory = signal<string>('todos');

  // Modal de galeria de fotos do projeto selecionado
  readonly activeProjectModal = signal<Project | null>(null);
  readonly selectedPhotoIndex = signal<number>(0);

  readonly categories = computed(() => {
    const list = this.allProjects();
    const set = new Set<string>();
    list.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['todos', ...Array.from(set)];
  });

  readonly filteredProjects = computed(() => {
    const cat = this.selectedCategory();
    const list = this.allProjects();
    if (cat === 'todos') return list;
    return list.filter(p => p.category.toLowerCase().trim() === cat.toLowerCase().trim());
  });

  openGallery(project: Project): void {
    this.activeProjectModal.set(project);
    this.selectedPhotoIndex.set(0);
  }

  closeGallery(): void {
    this.activeProjectModal.set(null);
    this.selectedPhotoIndex.set(0);
  }

  nextPhoto(): void {
    const proj = this.activeProjectModal();
    if (!proj || proj.photos.length === 0) return;
    this.selectedPhotoIndex.update(idx => (idx + 1) % proj.photos.length);
  }

  prevPhoto(): void {
    const proj = this.activeProjectModal();
    if (!proj || proj.photos.length === 0) return;
    this.selectedPhotoIndex.update(idx => (idx - 1 + proj.photos.length) % proj.photos.length);
  }

  selectPhoto(index: number): void {
    this.selectedPhotoIndex.set(index);
  }
}
