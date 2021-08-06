import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void { 
    if(this.isLogged()){
      
    }
  }

  isLogged(){
    return this.userService.isLoggedIn();
  }

  logout(){
    this.userService.logoutUser();
    this.router.navigate(["/"]);
  }

  getUsername(){
    return this.userService.getUserByCookie();
  }

}
