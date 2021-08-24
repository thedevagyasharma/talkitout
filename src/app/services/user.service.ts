import { Injectable } from '@angular/core';
import { User } from '../shared/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PasswordService } from './password.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = new Array<User>();
  url : string = "http://localhost:3000/users";
  ucount !: number;
  temp: User = new User();

  constructor(private http: HttpClient, private passService: PasswordService, private cookieService: CookieService) { }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.url);
  }

  getUserByEmail(email: string): User{
    this.getAllUsers().subscribe((users) => {this.users = users;})
    return this.users.filter(user => user.email == email)[0];
  }

  // getUserByEmail(email: string): Observable<User> | any{
  //   this.getAllUsers().subscribe(users => {this.users = users; return of(this.users.filter(user=>user.email == email)[0]);})
  // }

  getUserByCookie(): string{
    return this.cookieService.get('Username');
  }


  getUserCount(): number{
    this.getAllUsers().subscribe((users) => {this.ucount = users.length; return this.ucount;});
    return this.ucount;
  }

  registerUser(user: User): Observable<User>{
    console.log(user);
    user.id = this.getUserCount() + 1;
    console.log(user.id);
    user.password = this.passService.hashPass(user.password);
    return this.http.post<User>(this. url, user, httpOptions);
  }

  isLoggedIn(){
    return this.cookieService.check('Username');
  }

  logoutUser(){
    console.log("loggingout")
    this.cookieService.deleteAll();
  }

  resetPass(user: User): Observable<User>{
    user.password = this.passService.hashPass(user.password);
    return this.http.put<User>(this.url+"/"+user.id, user, httpOptions);
  }
}
