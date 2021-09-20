import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SpinnersAngularModule } from 'spinners-angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { StartmeetingComponent } from './components/startmeeting/startmeeting.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { MeetingsService } from './services/meetings.service';
import { MeetingComponent } from './components/meeting/meeting.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    StartmeetingComponent,
    ResetpasswordComponent,
    MeetingComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SpinnersAngularModule
  ],
  providers: [ CookieService, MeetingsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
