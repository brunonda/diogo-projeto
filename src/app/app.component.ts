import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalEvent, ModalState } from './core/models/modal.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly modalState = signal<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  handleModal(event: ModalEvent): void {
    this.modalState.set({
      isOpen: true,
      type: event.type,
      title: event.title,
      message: event.message
    });
  }

  closeModal(): void {
    this.modalState.update(state => ({ ...state, isOpen: false }));
  }
}
