import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path:'FormSelectores',
  loadChildren:() => import('./paises/paises.module').then(m => m.PaisesModule)
},
{
  path: '**',
  redirectTo: 'FormSelectores'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
