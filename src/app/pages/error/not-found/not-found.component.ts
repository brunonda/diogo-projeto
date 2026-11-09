import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen pt-32 pb-16 flex items-center justify-center px-4 bg-[#f7f7f8]">
      <div class="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200 text-center">
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 text-stone-700 mb-4">
          <i class="ph ph-compass text-3xl"></i>
        </span>
        <h1 class="text-2xl font-serif text-[#111113] font-bold">Página não encontrada (404)</h1>
        <p class="mt-3 text-xs sm:text-sm text-stone-500 leading-relaxed">
          O endereço informado não existe ou foi removido.
        </p>

        <div class="mt-8">
          <a routerLink="/" class="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors shadow">
            Voltar para a Página Inicial
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}

