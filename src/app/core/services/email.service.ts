import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuditService } from './audit.service';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  type: 'confirmacao_proposta' | 'aviso_designer' | 'convite_projeto' | 'recusa_proposta' | 'atualizacao_obra' | 'aprovacao_pendente';
  projectId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly auditService = inject(AuditService);

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; simulated: boolean }> {
    console.log(`[EmailService] Enviando e-mail para ${payload.to}: ${payload.subject}`);
    
    // Se o webhook do Apps Script estiver configurado
    if (environment.appsScriptUrl) {
      try {
        const response = await fetch(environment.appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          await this.auditService.log('ENVIO_EMAIL_APPS_SCRIPT', 'EMAIL', payload.to, 'system', payload.subject);
          return { success: true, simulated: false };
        }
      } catch (err) {
        console.warn('Falha no envio via Apps Script, operando em modo simulação:', err);
      }
    }

    // Modo simulação padrão (gratuito e transparente para demonstração / testes)
    await this.auditService.log('ENVIO_EMAIL_SIMULADO', 'EMAIL', payload.to, 'system', `${payload.type}: ${payload.subject}`);
    return { success: true, simulated: true };
  }

  // Templates de E-mail
  getInviteTemplate(clientName: string, appUrl: string): { subject: string; body: string } {
    return {
      subject: 'Bem-vindo ao Estúdio! Acesse o acompanhamento do seu projeto',
      body: `Olá ${clientName},\n\nSua proposta foi aceita com sucesso pelo nosso estúdio!\n\nAgora você pode acompanhar todas as fases da sua obra, fotos dos ambientes, documentos e aprovações diretamente no nosso sistema.\n\nPara acessar, entre com a sua conta Google usando este mesmo e-mail no link abaixo:\n${appUrl}/login\n\nEstamos ansiosos para transformar seu espaço!\n\nAtenciosamente,\nEquipe do Estúdio.`
    };
  }

  getRejectionTemplate(clientName: string, reason?: string): { subject: string; body: string } {
    return {
      subject: 'Atualização sobre sua solicitação de projeto - Estúdio',
      body: `Olá ${clientName},\n\nAgradecemos muito pelo interesse em nosso trabalho e pelo envio da sua proposta de projeto.\n\nNo momento, infelizmente não poderemos dar seguimento ao projeto solicitado${reason ? ` pelo seguinte motivo: ${reason}` : ' devido à nossa capacidade de agenda atual'}.\n\nDesejamos muito sucesso na realização da sua obra e esperamos poder colaborar em uma futura oportunidade!\n\nAtenciosamente,\nEquipe do Estúdio.`
    };
  }
}

