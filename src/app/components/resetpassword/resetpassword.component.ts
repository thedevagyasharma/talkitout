import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';

declare var require: any

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  otpsent: boolean = false;
  otpverified: boolean = false;
  otp!: number;
  response!: string;
  user !: User;

  sendForm = this.fb.group({
    email: ['', Validators.required]
  });

  verifyForm = this.fb.group({
    otp: ['', Validators.required]
  });

  changeForm = this.fb.group({
    password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
    cnfpassword: ['', Validators.required]
  },{validators: [this.passMatch()]})

  constructor(private userService:UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  private passMatch(): ValidatorFn{
    return (control: AbstractControl):ValidationErrors | null =>{
      const password = control.get("password")?.value;
      const confirm = control.get("cnfpassword")?.value;
  
      if(password!=confirm) {return{'noMatch':true}}
      return null;
    }
  }

  generateOTP(){
    this.userService.getAllUsers().subscribe((res =>{
      res = res.filter(use=> use.email == this.sendForm.get('email')?.value);
      if(res.length == 0){
        console.log("user does not exist");
        this.response = "notExists";
      }
      else if(!this.otpsent){
        this.user = res[0];
        this.response = "otpSent"
        var otpgen = require('otp-generator');
        this.otp = otpgen.generate(6, {alphabets: false, upperCase: false, specialChars: false});
        this.otpsent = true;
        alert(`OTP to reset password is ` + this.otp);
      }
      else{
        alert(`OTP to reset password is ` + this.otp);
      }
      
    }));
  }

  verifyOTP(){
    if(this.otp == this.verifyForm.get('otp')?.value){
      this.response = "";
      alert('OTP is verified you may change your password now')
      this.otpverified = true;
    }
    else{
      console.log("invalid otp")
      this.response = "invalidOTP"
    }
  }

  changePassword(){
    this.user.password = this.changeForm.get('password')?.value;
    this.userService.resetPass(this.user).subscribe(() => {
      this.response = "changed";
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 3000)
    })
    this.response = "inprogress"
  }


}
