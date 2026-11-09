import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen pt-32 pb-16 flex items-center justify-center px-4 bg-[#f7f7f8]">
      <div class="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200 text-center">
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 text-red-600 mb-4">
          <i class="ph ph-shield-warning text-3xl"></i>
        </span>
        <h1 class="text-2xl font-serif text-[#111113] font-bold">Acesso Restrito (403)</h1>
        <p class="mt-3 text-xs sm:text-sm text-stone-500 leading-relaxed">
          Você não possui permissão para acessar esta área. Verifique se está conectado com a conta Google correta e vinculada ao projeto.
        </p>

        <div class="mt-8 space-y-3">
          <a routerLink="/login" class="block w-full py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors shadow">
            Trocar de Conta / Fazer Login
          </a>
          <a routerLink="/" class="block w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 transition-colors">
            Voltar para o Início
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {
  readonly authService = inject(AuthService);
}

