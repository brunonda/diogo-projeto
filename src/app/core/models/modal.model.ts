export interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export interface ModalEvent {
  type: 'success' | 'error';
  title: string;
  message: string;
}
