import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PasswordService } from 'src/app/services/password.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user !: User;
  response !: string;

  logForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private cookieService: CookieService, private passService: PasswordService) { 
    this.user = new User();
  }

  ngOnInit(): void {
  }

  async onSubmit(){
    this.user.email = this.logForm.get('email')?.value;
    this.user.password = this.logForm.get('password')?.value;
    this.loginUser(this.user);
  }

  loginUser(user: User){
    const temppass = user.password;
    this.userService.getAllUsers().subscribe((res =>{
      res = res.filter(use=> use.email == user.email);
      if(res.length == 0){
        //console.log("user does not exist");
        this.response = "notExists";
      }
      else if(this.passService.hashPass(temppass) == res[0].password){
        this.cookieService.set('Username', res[0].name);
        this.cookieService.set('Logged In', 'true');
        this.router.navigate(["/"]);
      }
      else{
        //console.log("incorrect password")
        this.response = "incorrectPassword";
      }
    }));
  }

}
