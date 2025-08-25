import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { IndexComponent } from './index/index.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: 'coffee', redirectTo: 'coffee/index', pathMatch: 'full' },
  { path: 'coffee/index', component: IndexComponent },
  { path: 'coffee/:coffeeId/view', component: ViewComponent },
  { path: 'coffee/create', component: CreateComponent },
  { path: 'coffee/:coffeeId/edit', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoffeeRoutingModule {}
