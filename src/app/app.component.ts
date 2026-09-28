import { Component, signal } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { BriefingComponent } from './components/briefing/briefing.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalEvent, ModalState } from './core/models/modal.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    PortfolioComponent,
    BriefingComponent,
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
