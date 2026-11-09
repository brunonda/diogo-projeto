import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
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
  private readonly projectService = inject(ProjectService);
  readonly showModalEvent = output<ModalEvent>();
  
  readonly isSubmitting = signal(false);

  readonly briefingForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    projectType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    budget: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    lgpdConsent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    // Campo Honeypot para proteção contra bots (deve permanecer vazio)
    websiteHoneypot: new FormControl('', { nonNullable: true })
  });

  async onSubmit(): Promise<void> {
    if (this.briefingForm.invalid) {
      this.briefingForm.markAllAsTouched();
      return;
    }
    
    // Se o bot preencheu o campo invisível, descarta silenciosamente
    if (this.briefingForm.value.websiteHoneypot) {
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const formValue = this.briefingForm.getRawValue();
      const proposalData: ProposalData = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        projectType: formValue.projectType,
        budget: formValue.budget,
        description: formValue.description,
        lgpdConsent: formValue.lgpdConsent,
        honeypot: formValue.websiteHoneypot
      };

      await this.projectService.submitProposal(proposalData);
      
      this.showModalEvent.emit({
        type: 'success',
        title: 'Proposta Enviada com Sucesso!',
        message: 'Recebemos suas informações com segurança. Enviamos um e-mail de confirmação para você e o designer retornará em até 48 horas úteis.'
      });
      
      this.briefingForm.reset({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        description: '',
        lgpdConsent: false,
        websiteHoneypot: ''
      });
    } catch (error: any) {
      this.showModalEvent.emit({
        type: 'error',
        title: 'Não foi possível enviar',
        message: error?.message || 'Falha ao enviar sua proposta. Por favor, tente novamente.'
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
