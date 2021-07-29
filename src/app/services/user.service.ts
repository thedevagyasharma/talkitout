import { Injectable } from '@angular/core';
import { User } from '../shared/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PasswordService } from './password.service';


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
  ucount: number = 0;

  constructor(private http: HttpClient, private passService: PasswordService) { }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.url);
  }

  getUserCount(): number{
    this.getAllUsers().subscribe((users) => this.ucount = users.length)
    return this.ucount;
  }

  registerUser(user: User): Observable<User>{
    console.log(user);
    user.id = this.getUserCount() + 1;
    console.log(user.id);
    user.password = this.passService.hashPass(user.password);
    return this.http.post<User>(this. url, user, httpOptions);
  }
}
