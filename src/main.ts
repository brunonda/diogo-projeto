import { bootstrapApplication } from '@angular/platform-browser';
import { Component, LOCALE_ID } from '@angular/core';
import { ProjectListComponent } from './app/components/project-list/project-list.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProjectListComponent],
  template: `
    <header class="app-header">
      <h1>Painel do Designer</h1>
    </header>
    <main class="container">
      <app-project-list></app-project-list>
    </main>
  `
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
}).catch((err) => console.error(err));