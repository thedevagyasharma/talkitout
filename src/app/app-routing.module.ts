import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StartmeetingComponent } from './components/startmeeting/startmeeting.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { MeetingComponent } from './components/meeting/meeting.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'newmeeting', component: StartmeetingComponent},
  {path: 'joinmeeting', component: StartmeetingComponent},
  {path: 'reset', component: ResetpasswordComponent},
  {path: 'meeting', component: MeetingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
