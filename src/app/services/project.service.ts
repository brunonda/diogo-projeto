import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    { id: 1, clientName: 'Ana Silva', roomType: 'Cozinha Planejada', budget: 15000, status: 'Em Andamento' },
    { id: 2, clientName: 'Carlos Souza', roomType: 'Sala de Estar', budget: 8500, status: 'Pendente' },
    { id: 3, clientName: 'Juliana Costa', roomType: 'Quarto Casal', budget: 12000, status: 'Concluído' }
  ];

  getProjects(): Observable<Project[]> {
    // Simula uma requisição HTTP assíncrona retornando os projetos
    return of(this.projects);
  }
}