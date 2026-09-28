import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { ModalEvent } from '../../core/models/modal.model';
import { ProposalData } from '../../core/models/proposal.model';

@Component({
  selector: 'app-briefing',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './briefing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BriefingComponent {
  private readonly firebaseService = inject(FirebaseService);
  readonly showModalEvent = output<ModalEvent>();
  
  readonly isSubmitting = signal(false);

  readonly briefingForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    projectType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    budget: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  async onSubmit(): Promise<void> {
    if (this.briefingForm.invalid) return;
    
    this.isSubmitting.set(true);
    
    try {
      const formData = this.briefingForm.getRawValue() as ProposalData;
      await this.firebaseService.submitProposal(formData);
      
      this.showModalEvent.emit({
        type: 'success',
        title: 'Proposta Recebida!',
        message: 'Seus dados foram enviados com sucesso. Analisaremos o perfil do projeto e entraremos em contato em breve.'
      });
      
      this.briefingForm.reset({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        description: ''
      });
    } catch (error) {
      this.showModalEvent.emit({
        type: 'error',
        title: 'Ops, ocorreu um erro',
        message: 'Falha ao enviar sua proposta. Por favor, verifique sua conexão ou tente mais tarde.'
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
