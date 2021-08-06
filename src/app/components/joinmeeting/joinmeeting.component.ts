import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ZoomMtg } from '@zoomus/websdk';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';

ZoomMtg.preLoadWasm();
//ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-joinmeeting',
  templateUrl: './joinmeeting.component.html',
  styleUrls: ['./joinmeeting.component.scss']
})

export class JoinmeetingComponent implements OnInit {

  joinform = this.fb.group({
    meetingNumber : ['', Validators.required],
    meetingPassword: ['']
  })



  signatureEndpoint = 'http://localhost:4000'
  apiKey = 'SPv_tb4OREegdpGaclN7IQ'
  meetingNumber = this.joinform.get('meetingNumber')?.value;
  role = 0
  leaveUrl = 'http://localhost:4200'
  userName = this.cookieService.get('Username');
  userEmail = ''
  passWord = 'TFgzSk16bmR2NW05SEtUblQ1RU8xdz09'
  registrantToken = '';
  display = false;
  
  constructor(private fb: FormBuilder, private cookieService: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this.getSignature();
  }

  getSignature(){
    this.http.post(this.signatureEndpoint, {
      'meetingNumber': this.meetingNumber,
      'role': this.role
    }).subscribe((data:any) => {
      if(data.signature){
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    })
  }

  startMeeting(signature: string){
    this.display = true;
    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      success: (success:any) => {
        console.log(success);
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          tk: this.registrantToken,
          success: (success: any) => {
            console.log(success)
          },
          error: (error: any) => {
            console.log(error)
          }
        })
      }
    })
  }

}
