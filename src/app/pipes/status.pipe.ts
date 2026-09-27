import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'Pendente': return '#e74c3c'; // Vermelho
      case 'Em Andamento': return '#f1c40f'; // Amarelo
      case 'Concluído': return '#2ecc71'; // Verde
      default: return '#95a5a6'; // Cinza
    }
  }
}