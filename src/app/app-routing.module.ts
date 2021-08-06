import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StartmeetingComponent } from './components/startmeeting/startmeeting.component';
import { JoinmeetingComponent} from './components/joinmeeting/joinmeeting.component'

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'newmeeting', component: StartmeetingComponent},
  {path: 'joinmeeting', component: JoinmeetingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
