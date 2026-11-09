import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile, UserRole } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { AuditService } from './audit.service';
import { environment } from '../../../environments/environment';

const SESSION_KEY = 'estudio_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly firebaseService = inject(FirebaseService);
  private readonly auditService = inject(AuditService);

  readonly currentUser = signal<UserProfile | null>(this.loadStoredUser());
  readonly isLoading = signal<boolean>(false);

  readonly role = computed<UserRole>(() => this.currentUser()?.role || 'visitor');
  readonly isAuthenticated = computed<boolean>(() => !!this.currentUser());
  readonly isDesigner = computed<boolean>(() => this.role() === 'designer');

  constructor() {
    this.listenToAuthChanges();
  }

  private loadStoredUser(): UserProfile | null {
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveUserSession(user: UserProfile | null): void {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    this.currentUser.set(user);
  }

  private listenToAuthChanges(): void {
    const auth = this.firebaseService.getAuthInstance();
    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            const email = (fbUser.email || '').toLowerCase().trim();
            const role = this.determineRole(email);
            if (role !== 'designer') {
              await this.firebaseService.logout();
              this.saveUserSession(null);
              return;
            }
            const profile: UserProfile = {
              uid: fbUser.uid,
              email,
              displayName: fbUser.displayName || 'Designer Diogo',
              photoURL: fbUser.photoURL || undefined,
              role: 'designer',
              emailVerified: fbUser.emailVerified
            };
            this.saveUserSession(profile);
            await this.auditService.log('LOGIN_FIREBASE', 'AUTH', fbUser.uid, email, 'Login com Google Designer via Firebase');
          } else if (!sessionStorage.getItem(SESSION_KEY)) {
            this.saveUserSession(null);
          }
        });
      });
    }
  }

  determineRole(email: string): UserRole {
    const designerEmail = (environment.designerEmail || '').toLowerCase().trim();
    if (email.toLowerCase().trim() === designerEmail) {
      return 'designer';
    }
    return 'visitor';
  }

  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    this.isLoading.set(true);
    try {
      if (this.firebaseService.isReady()) {
        const user = await this.firebaseService.loginWithGoogle();
        if (user) {
          const email = (user.email || '').toLowerCase().trim();
          const role = this.determineRole(email);
          if (role !== 'designer') {
            await this.firebaseService.logout();
            this.saveUserSession(null);
            return {
              success: false,
              error: 'Acesso restrito: Clientes não realizam login no site. Apenas o designer cadastrado pode acessar o painel.'
            };
          }
          const profile: UserProfile = {
            uid: user.uid,
            email,
            displayName: user.displayName || 'Designer Diogo',
            photoURL: user.photoURL || undefined,
            role: 'designer',
            emailVerified: user.emailVerified
          };
          this.saveUserSession(profile);
          await this.auditService.log('LOGIN_GOOGLE_SUCCESS', 'AUTH', user.uid, email, 'Autenticação Google do Designer');
          return { success: true };
        }
      }

      // Se Firebase não estiver configurado localmente com chaves de produção
      const simulatedEmail = window.prompt(
        'Informe o e-mail da sua conta Google Designer para autenticar:',
        environment.designerEmail
      );

      if (simulatedEmail) {
        return this.simulateLogin(simulatedEmail.trim());
      }

      return { success: false, error: 'Login cancelado.' };
    } catch (err: any) {
      console.error('Erro na autenticação Google:', err);
      return { success: false, error: err?.message || 'Falha ao autenticar com o Google.' };
    } finally {
      this.isLoading.set(false);
    }
  }

  simulateLogin(email: string, displayName?: string): { success: boolean; error?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const role = this.determineRole(cleanEmail);
    if (role !== 'designer') {
      return {
        success: false,
        error: 'Acesso restrito: Clientes não realizam login no site. Apenas o designer pode gerenciar fotos dos projetos.'
      };
    }

    const profile: UserProfile = {
      uid: 'sim_' + Date.now(),
      email: cleanEmail,
      displayName: displayName || 'Designer Diogo',
      role: 'designer',
      emailVerified: true
    };
    this.saveUserSession(profile);
    this.auditService.log('LOGIN_SIMULADO', 'AUTH', profile.uid, cleanEmail, 'Login do Designer');
    return { success: true };
  }

  async logout(): Promise<void> {
    const user = this.currentUser();
    if (user) {
      await this.auditService.log('LOGOUT', 'AUTH', user.uid, user.email, 'Usuário desconectado');
    }
    await this.firebaseService.logout();
    this.saveUserSession(null);
    this.router.navigate(['/']);
  }
}
