import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly designerEmail = environment.designerEmail;
  readonly errorMessage = signal('');
  readonly isProcessing = signal(false);

  async handleGoogleLogin(): Promise<void> {
    this.errorMessage.set('');
    this.isProcessing.set(true);

    try {
      const result = await this.authService.loginWithGoogle();
      if (result.success) {
        this.redirectAfterLogin();
      } else if (result.error) {
        this.errorMessage.set(result.error);
      }
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Falha ao autenticar.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  simulateDesignerLogin(): void {
    this.errorMessage.set('');
    const res = this.authService.simulateLogin(this.designerEmail, 'Designer Diogo');
    if (res.success) {
      this.redirectAfterLogin();
    } else if (res.error) {
      this.errorMessage.set(res.error);
    }
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl && returnUrl.startsWith('/designer')) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/designer']);
    }
  }
}
