import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user !: User;
  cnfpassword !: string;

  constructor(private userService: UserService, private router: Router) { 
    this.user = new User();
  }

  ngOnInit(): void {
  }


  onSubmit(form: NgForm){
    this.user.name = form.value.name;
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    this.userService.registerUser(this.user).subscribe((user) =>this.router.navigate(["/login"]));
  }

}
