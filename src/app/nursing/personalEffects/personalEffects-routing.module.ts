import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalEffectsComponent } from './list/personalEffects.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalEffectsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalEffectsRoutingModule {}
