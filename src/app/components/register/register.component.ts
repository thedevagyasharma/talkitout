import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  user !: User;
  exists : boolean = false;
  

  regForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
    cnfpass: ['', [Validators.required]]
    }, {validators: [this.passMatch(), this.userExists()]});

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { 
    this.user = new User();
  }

  ngOnInit(): void {
  }

  private userExists(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.userService.getUserByEmail(control.get("email")?.value.toLowerCase())){
        return{'userExist':true};
      } else {
        return null;  
      }
      
    }
  }

  private passMatch(): ValidatorFn{
    return (control: AbstractControl):ValidationErrors | null =>{
      const password = control.get("password")?.value;
      const confirm = control.get("cnfpass")?.value;
  
      if(password!=confirm) {return{'noMatch':true}}
      return null;
    }
  }

  onSubmit(){
    this.user.email = this.regForm.get('email')?.value;
    this.user.name = this.regForm.get('name')?.value;
    this.user.password = this.regForm.get('password')?.value;
    this.userService.registerUser(this.user).subscribe((user) => {console.log("registered successfully"); this.router.navigateByUrl("/login")});
  }


}
