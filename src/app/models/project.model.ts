export interface Project {
  id: number;
  clientName: string;
  roomType: string;
  budget: number;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
}