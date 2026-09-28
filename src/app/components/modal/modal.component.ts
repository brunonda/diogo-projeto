import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly type = input<'success' | 'error'>('success');
  readonly closeModal = output<void>();

  onClose(): void {
    this.closeModal.emit();
  }
}
