import { Injectable, inject } from '@angular/core';
import { AuditLog } from '../models/project.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly firebaseService = inject(FirebaseService);

  private readonly storageKey = 'estudio_audit_logs';

  async log(action: string, entity: string, entityId: string, userEmail: string, details?: string): Promise<void> {
    const logEntry: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      action,
      entity,
      entityId,
      userEmail: userEmail || 'anonymous',
      details,
      timestamp: new Date().toISOString()
    };

    // Tenta salvar via Firebase se configurado
    try {
      if (this.firebaseService.isReady()) {
        await this.firebaseService.addAuditLog(logEntry);
      }
    } catch {
      // Ignora falha remota e garante registro local
    }

    // Persistência local segura para contingência
    try {
      const existing: AuditLog[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      existing.unshift(logEntry);
      localStorage.setItem(this.storageKey, JSON.stringify(existing.slice(0, 100)));
    } catch (e) {
      console.warn('Erro ao salvar log local:', e);
    }
  }

  getLogs(): AuditLog[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }
}

