import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesComponent } from '../../components/services/services.component';
import { PortfolioComponent } from '../../components/portfolio/portfolio.component';
import { BriefingComponent } from '../../components/briefing/briefing.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalEvent, ModalState } from '../../core/models/modal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ServicesComponent,
    PortfolioComponent,
    BriefingComponent,
    ModalComponent
  ],
  template: `
    <main>
      <app-hero></app-hero>
      <app-services></app-services>
      <app-portfolio></app-portfolio>
      <app-briefing (showModalEvent)="handleModal($event)"></app-briefing>
    </main>

    <app-modal
      [isOpen]="modalState().isOpen"
      [title]="modalState().title"
      [message]="modalState().message"
      [type]="modalState().type"
      (closeModal)="closeModal()"
    ></app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
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

