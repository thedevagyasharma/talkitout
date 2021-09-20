import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { VideotokenService } from 'src/app/services/videotoken.service';
import { interval } from 'rxjs';
import { MeetingsService } from 'src/app/services/meetings.service';
import { Router } from '@angular/router';
import { Meeting } from '../../shared/meeting.model';
import { FormBuilder, Validators } from '@angular/forms';


const micAnimDelay = interval(200);

@Component({
  selector: 'app-startmeeting',
  templateUrl: './startmeeting.component.html',
  styleUrls: ['./startmeeting.component.scss']
})
export class StartmeetingComponent implements OnInit {
  Arr = Array;
  
  spinner: boolean = false;

  constructor(private cookieService: CookieService, private tokenService: VideotokenService, private meetService: MeetingsService, private router: Router, private fb: FormBuilder) { }
  userName = this.cookieService.get('Username').toString();
  //userName = "Devagya"
  //Video Preview Flags
  isbtnclckd = false
  iscamon = false;

  //Audio Preview Flags
  isAudioConnected = false;
  isMuted = true;
  isabtnclckd = false;
  prevMicFBStyle = 0;
  micFBInterval : any;

  //depAsset = window.location.origin + ":4200/node_modules/@zoom/videosdk/dist/lib"
  depAsset = "Global"

  newMeetingForm = this.fb.group({
    topic: ['',[Validators.required]],
    password: ['',[Validators.required]]
  })


  ngOnInit(): void {
  }


  async createNewMeeting(){
    this.meetService.vidClient.init('en-US', this.depAsset)
    this.meetService.vidClient.join(
      this.newMeetingForm.get('topic')?.value,
      this.tokenService.generateVideoToken("FcUHdiWMrHFeqQd5jKJqWQz6nOXWQHJDjlua","sn9Vc2mln3urlQIBjE9USoczbOeiJEQcz9CG",this.newMeetingForm.get('topic')?.value, this.newMeetingForm.get('password')?.value),
      this.userName,
      this.newMeetingForm.get('password')?.value
    ).then(()=>{
      this.spinner = false;
      console.log("Join Meeting Success")
      this.router.navigateByUrl('/meeting')
    }).catch((error) => {
      console.error(error);
    });
    this.spinner = true;
  }

  logUser(){
    let part = this.meetService.vidClient.getAllUser();
    console.log(part);
  }

  async testCamera(){
    const vidbox = document.querySelector("#vid-prev") as HTMLVideoElement;
    if(!this.isbtnclckd){
      this.isbtnclckd = true;
      if(!this.iscamon){
        try{
          this.iscamon = !this.iscamon;
          document.querySelector("#btn-cam-prev")?.classList.replace("off","on");
          await this.meetService.localVideoTrack.start(vidbox);
        } catch (e){
          this.iscamon = !this.iscamon;
          console.error("Error toggling video", e);
        }
      } else {
        try{
          this.iscamon = !this.iscamon;
          document.querySelector("#btn-cam-prev")?.classList.replace("on","off");
          await this.meetService.localVideoTrack.stop();
        } catch (e) {
          this.iscamon = !this.iscamon;
          console.error("Error toggling video", e);
        }
      }
      this.isbtnclckd = false;
    } else {
      console.log("Already Toggling Camera");
    }
  }

  async testMic(){
    if(!this.isabtnclckd){
      if(!this.isAudioConnected){
        try{
          await this.meetService.localAudioTrack.start();
          this.isAudioConnected = true;
        } catch (e){
          console.error('Error connecting audio');
        }
        this.testMic();
      } else {
        if(!this.isMuted){
          this.meetService.localAudioTrack.mute().then(()=>{
            clearInterval(this.micFBInterval);
            this.prevMicFBStyle = 0;
            this.isMuted = !this.isMuted;
          });
        } else {
          this.meetService.localAudioTrack.unmute().then(()=>{
            this.micFBInterval = setInterval(this.updateMicFeedbackStyle, 100);
            this.isMuted = !this.isMuted;
          });
          
        }
      }
      
    }
  }

  updateMicFeedbackStyle = () => {
    const newVolumeIntensity = parseFloat(this.meetService.localAudioTrack.getCurrentVolume().toFixed(5));
    let newMicFeedbackStyle = 0;
    if (newVolumeIntensity === 0) {
      newMicFeedbackStyle = 0;
    } else if (newVolumeIntensity <= 0.05) {
      newMicFeedbackStyle = 1;
    } else if (newVolumeIntensity <= 0.1) {
      newMicFeedbackStyle = 2;
    } else if (newVolumeIntensity <= 0.15) {
      newMicFeedbackStyle = 3;
    } else if (newVolumeIntensity <= 0.2) {
      newMicFeedbackStyle = 4;
    } else if (newVolumeIntensity <= 0.25) {
      newMicFeedbackStyle = 5;
    } else {
      newMicFeedbackStyle = 6;
    }
    this.prevMicFBStyle = newMicFeedbackStyle;
  }

  hasRoute(route:string){
    return this.router.url.includes(route);
  }
  

}
