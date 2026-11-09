import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-designer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerDashboardComponent {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<string>('todos');

  // Modal de criação de novo projeto
  readonly isCreatingProject = signal(false);
  readonly newTitle = signal('');
  readonly newCategory = signal('Residencial');
  readonly newDescription = signal('');
  readonly newCoverUrl = signal('');
  readonly createError = signal('');

  // Signals do serviço
  readonly allProjects = this.projectService.projectsSignal;

  readonly totalPhotosCount = computed(() => {
    return this.allProjects().reduce((acc, p) => acc + (p.photos?.length || 0), 0);
  });

  readonly categories = computed(() => {
    const set = new Set<string>();
    this.allProjects().forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['todos', ...Array.from(set)];
  });

  readonly filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    let list = [...this.allProjects()];

    if (cat !== 'todos') {
      list = list.filter(p => p.category.toLowerCase().trim() === cat.toLowerCase().trim());
    }

    if (query) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return list;
  });

  openCreateModal(): void {
    this.newTitle.set('');
    this.newCategory.set('Residencial');
    this.newDescription.set('');
    this.newCoverUrl.set('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200');
    this.createError.set('');
    this.isCreatingProject.set(true);
  }

  closeCreateModal(): void {
    this.isCreatingProject.set(false);
    this.createError.set('');
  }

  async handleCreateProject(): Promise<void> {
    if (!this.newTitle().trim()) {
      this.createError.set('Informe o título do projeto.');
      return;
    }
    if (!this.newCoverUrl().trim()) {
      this.createError.set('Informe a URL da foto principal/capa.');
      return;
    }

    try {
      const created = await this.projectService.addProject({
        title: this.newTitle().trim(),
        category: this.newCategory().trim(),
        description: this.newDescription().trim(),
        coverUrl: this.newCoverUrl().trim()
      });

      this.closeCreateModal();
      this.router.navigate(['/designer/projeto', created.id]);
    } catch (err: any) {
      this.createError.set(err?.message || 'Erro ao criar projeto.');
    }
  }

  async handleDeleteProject(project: Project, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.title}" e todas as suas fotos?`)) {
      await this.projectService.deleteProject(project.id);
    }
  }
}
