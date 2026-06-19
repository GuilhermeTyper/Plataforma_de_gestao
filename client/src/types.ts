export interface Collaborator {
  id: string;
  name: string;
  role: 'organizador' | 'editor' | 'visualizador';
  avatarUrl: string;
}

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluido';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignedId: string; // Refers to Collaborator ID
  sentimentType: 'Ansioso' | 'Desafiado' | 'Desafiada' | 'Focado' | 'Satisfeito' | 'Animado' | 'Neutro';
  sentimentText: string;
  progress?: number; // 0 to 100
  eventId: string;
}

export interface Event {
  id: string;
  title: string;
  organizerId: string; // Collaborator ID
  startDate: string;
  endDate: string;
}
