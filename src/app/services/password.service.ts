import { Injectable } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import { User } from '../shared/user.model';


@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  md5: Md5 = new Md5();
  salt: string = "saltforpass";
  password!: string;

  constructor() { }

  hashPass(incoming: string): string{
    this.password = Md5.hashStr(this.salt.concat(incoming));  
    return this.password;
  }
}
