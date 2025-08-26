import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

export const coffeeRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: ':coffeeId/view', component: ViewComponent },
  { path: 'create', component: CreateComponent },
  { path: ':coffeeId/edit', component: EditComponent },
];
