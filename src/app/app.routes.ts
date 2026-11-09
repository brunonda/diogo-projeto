import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DesignerDashboardComponent } from './pages/designer/dashboard/dashboard.component';
import { DesignerProjectDetailComponent } from './pages/designer/project-detail/project-detail.component';
import { ForbiddenComponent } from './pages/error/forbidden/forbidden.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { designerGuard } from './core/guards/designer.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Estúdio de Design de Interiores & Obras'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Área do Designer - Estúdio'
  },
  {
    path: 'designer',
    canActivate: [designerGuard],
    children: [
      {
        path: '',
        component: DesignerDashboardComponent,
        title: 'Portfólio de Projetos - Painel do Designer'
      },
      {
        path: 'projeto/:id',
        component: DesignerProjectDetailComponent,
        title: 'Gerenciar Fotos do Projeto - Estúdio'
      }
    ]
  },
  {
    path: 'cliente',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '403',
    component: ForbiddenComponent,
    title: 'Acesso Negado (403) - Estúdio'
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'Página Não Encontrada - Estúdio'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
