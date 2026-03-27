import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistionComponent} from './pages/registion/registion.component'
import { ProfilComponent } from './pages/profil/profil.component';
import { PinComponent } from './pages/pin/pin.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registion', component: RegistionComponent},
  { path: 'profil', component: ProfilComponent},
  { path: 'pin', component: PinComponent}
];
