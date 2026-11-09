import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'Orçamento':
        return '#d97706'; // Amber 600
      case 'Pendente de Cadastro':
        return '#6366f1'; // Indigo 500
      case 'Iniciar':
        return '#2563eb'; // Blue 600
      case 'Em Andamento':
        return '#0284c7'; // Sky 600
      case 'Concluído':
        return '#16a34a'; // Green 600
      case 'Pausado':
        return '#ea580c'; // Orange 600
      case 'Cancelado':
        return '#64748b'; // Slate 500
      case 'Recusado':
        return '#dc2626'; // Red 600
      case 'Pendente':
        return '#e11d48'; // Rose
      default:
        return '#78716c'; // Stone 500
    }
  }
}