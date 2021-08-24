import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
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
  meetingNumber = ''
  role = 0  
  leaveUrl = 'http://localhost:4200/joinmeeting'
  userName = this.cookieService.get('Username');
  userEmail = ''
  passWord = ''
  registrantToken = '';
  
  constructor(private fb: FormBuilder, private cookieService: CookieService, private http: HttpClient) {   }

  ngOnInit() {
    
  }

  onSubmit(){
    this.meetingNumber = this.joinform.get('meetingNumber')?.value;
    this.passWord = this.joinform.get('meetingPassword')?.value;
    this.getSignature();
  }

  getSignature(){
    this.http.post(this.signatureEndpoint, {
      meetingNumber: this.meetingNumber,
      role: this.role
    }).subscribe((data:any) => {
      if(data.signature){
        //console.log("call",data)
        this.startMeeting(data.signature)
      } else {
        console.log("error",data)
      }
    })
  }

  startMeeting(signature: string){
    const tag = document.querySelector("#zmmtg-root")
    if(tag){
      tag.setAttribute("style","display:block!important") 
    }
    
    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      success: (success:any) => {
        console.log(success)
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          tk: this.registrantToken,
          success: (success:any) => {
            console.log(success)
          },
          error: (error:any) => {
            console.log(error)
          }
        })

      },
      error: (error:any) => {
        console.log(error)
      }
    })
  }

}
