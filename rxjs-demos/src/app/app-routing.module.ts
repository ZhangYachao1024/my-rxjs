import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorsComponent } from './components/operators/operators.component';
import { SubjectsComponent } from './components/subjects/subjects.component';

const routes: Routes = [{
    path: 'operators',
    component: OperatorsComponent,
}, {
    path: 'subjects',
    component: SubjectsComponent,
}, {
    path: '',
    redirectTo: 'operators',
    pathMatch: 'full',
}, {
    path: '**',
    redirectTo: 'operators',
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
