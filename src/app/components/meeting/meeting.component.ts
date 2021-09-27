import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatMessage, Participant, SessionInfo } from '@zoom/videosdk';
import { MeetingsService } from 'src/app/services/meetings.service';
import { Meeting } from 'src/app/shared/meeting.model';


@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  mediaStream: any;
  chatClient: any;
  myUserID!: number;
  hostId!: number;
  users!: Participant[];
  hostName!: string;

  client: any;
  canvas: any; // canvas to render the video
  screenCanvas: any;

  renderedList!: Participant[];
  page = 0;
  pageSize = 5;

  timerInterval = setInterval(this.currentTime, 60000);

  chatMessages: ChatMessage[] = [];

  //booleans to keep track of elements and devices
  chatbox: boolean = false;
  partList: boolean = false;
  menuBox: boolean = false;
  micOn: boolean = false;
  camOn: boolean = false;
  screenOn: boolean = false;
  screenIn: boolean = false;

  chatForm = this.fb.group({
    sendMessage: ['',[Validators.required]],
  });


  constructor(private meetService: MeetingsService, private router: Router, private fb: FormBuilder) { 
    //event-listeners and callbacks
    this.client.on('user-added', ()=>{
      this.users = this.client.getAllUser();
      this.handleParticipantsChange();
    });

    this.client.on('user-removed', ()=>{
      this.users = this.client.getAllUser();
    });

    this.client.on('user-updated',()=>{
      this.users = this.client.getAllUser();
      this.handleParticipantsChange();
    });

    this.client.on('chat-on-message',(payload: any) =>{
      const msgTime = this.convertTimestamp(payload.timestamp);
      payload.timestamp = msgTime;
      this.chatMessages.push(payload);
    });

    this.client.on('active-share-change', (payload:any)=>{
      if(payload.state==="Active"){
        this.mediaStream.startShareView(this.screenCanvas, payload.userId);
        this.screenIn = true;
      } else if(payload.state==="Inactive"){
        this.mediaStream.stopShareView();
        this.screenIn = false;
      }
    });

    this.client.on('connection-change', (payload:any)=>{
      if(payload.reason==="ended by host"){
        this.leaveMeeting();
      }
    });

    this.client.on('current-audio-change',(payload:any)=>{
      if(payload.action==="muted"){
        this.micOn = false;
      }
    });

    this.client.on('peer-video-state-change', (payload: { action: "Start" | "Stop"; userId: number })=>{
      this.toggleParticipantVideo(payload);
    });
  }

  async ngOnInit(): Promise<void> {
    this.screenCanvas = document.querySelector('#screencanvas');
    console.log("Canvas",this.canvas);
    console.log("Screen Canvas", this.screenCanvas);

    this.client = this.meetService.vidClient;
    this.mediaStream = this.meetService.vidClient.getMediaStream();
    this.chatClient = this.meetService.vidClient.getChatClient();

    await this.mediaStream.startAudio().then(async () => {
      this.micOn = true;
      await this.mediaStream.muteAudio().then(this.micOn = false)});

    this.myUserID = this.meetService.vidClient.getCurrentUserInfo().userId;
    this.hostId = this.meetService.vidClient.getAllUser().filter((user)=>user.isHost==true)[0].userId;
    this.hostName = this.meetService.vidClient.getAllUser().filter((user)=>user.isHost==true)[0].displayName;



    this.users = this.meetService.vidClient.getAllUser();
  }

  handleParticipantsChange(){
    this.users = this.meetService.vidClient.getAllUser();
    this.renderedList = this.users.filter((user)=>user.bVideoOn==true);
    console.log("Video on", this.renderedList);
    
  }


  async toggleMicSelf(){
    if(!this.micOn){
      try{
        await this.mediaStream.unmuteAudio().then(() => {
          this.micOn = true;
        });   
      } catch(e) {
        console.error("Mic Toggle Error", e);
      }
    }
    else{
      try{
        await this.mediaStream.muteAudio().then(()=>{
          this.micOn = false;
        });
      } catch(e) {
        console.error("Mic Toggle Error", e);
      } 
    }
  }

  async toggleSelfVideo(){
    if(!this.camOn){
      try{
        this.canvas = document.querySelector("#"+this.canvasId(this.myUserID));
        await this.mediaStream.startVideo().then(this.camOn=true);
        await this.mediaStream.renderVideo(this.canvas, this.myUserID, 694, 390, 0, 0, 1);
      } catch(e) {
        console.error(e);
        this.mediaStream.stopVideo();
        this.camOn = false;
      }
    } else {
      await this.mediaStream.stopVideo();
      await this.mediaStream.stopRenderVideo(this.canvas, this.myUserID);
      await this.mediaStream.clearVideoCanvas(this.canvas);
      this.camOn = false;
    }
  }

  async toggleParticipantVideo(payload:{action: "Start" | "Stop"; userId: number }){
    const canvas = document.querySelector("#"+this.canvasId(payload.userId))
    if(payload.action == "Start"){
      try{
        await this.mediaStream.renderVideo(canvas, payload.userId, 694, 390, 0, 0, 1);
      } catch (e) {
        console.error("Partvid",e);
      }
    } else if(payload.action === "Stop"){
      await this.mediaStream.stopRenderVideo(canvas, payload.userId)
      await this.mediaStream.clearVideoCanvas(canvas);
    }  
  }

  async shareScreen(){
    if(!this.screenOn){
      try{
        this.mediaStream.startShareScreen(this.screenCanvas);
        this.screenOn = true;
      } catch(e) {
        console.error(e);
      } 
    } else {
      this.mediaStream.stopShareScreen(this.screenCanvas);
      this.mediaStream.clearVideoCanvas(this.screenCanvas);
      this.screenOn = false;
    }
    
  }

  async muteAll(){
    this.users = this.meetService.vidClient.getAllUser();
    this.users.forEach((user)=>this.mediaStream.muteAudio(user.userId));
  }

  sendChat(){
    const message = this.chatForm.get('sendMessage')?.value;
    this.chatForm.get('sendMessage')?.reset();
    // this.chatMessages.push(message);
    this.chatClient.sendToAll(message).then().catch((error: any)=>console.error(error));
  }


  openChat(){
    this.partList = false;
    this.chatbox = true;
  }

  openPart(){
    this.chatbox = false;
    this.partList = true;
  }

  closeSide(){
    this.chatbox = false;
    this.partList = false;
  }

  toggleMenu(){
    if(!this.menuBox){
        this.menuBox = true;
    } else {
      this.menuBox = false;
    }
  }

  leaveMeeting(){
    try{
      this.myUserID = 0;
      this.users = [];
      this.micOn = false;
      this.camOn = false;
      this.meetService.vidClient.leave();
    }
    catch(e) {
      console.error("Error", e);
    }
    finally{
      this.router.navigateByUrl("/");
    }
  }

  endMeeting(){
    this.myUserID = 0;
    this.users = [];
    this.micOn = false;
    this.camOn = false;
    clearInterval(this.timerInterval);
    this.meetService.getMeeting(this.getSession().topic).subscribe((meetings: Meeting[])=>{
      this.meetService.deleteMeeting(meetings[0].id).subscribe((res)=>console.log(res))
    })
   
    this.meetService.vidClient.leave(true);
    this.router.navigateByUrl("/");
  }

  initials(name: String){
    return name.match(/\b\w/g)?.join('');
  }

  canvasId(userId: number){
    let curUser = this.users.filter((user)=>user.userId===userId)[0];
    return this.initials(curUser.displayName) + curUser.userId.toString();
  }

  getSession(): SessionInfo{
    return this.meetService.vidClient.getSessionInfo();
  }

  currentTime(){
    let time = Date.now();
    setInterval(()=>{
      let time =  Date.now();
      return this.convertTimestamp(time);
    }, 60000);
    return this.convertTimestamp(time)
    
  }

  convertTimestamp(timestamp: number) {
    const d = new Date(timestamp);	// Convert the passed timestamp to milliseconds
    let hh = d.getHours()
    let min = ('0' + d.getMinutes()).slice(-2);		// Add leading 0.
    let ampm = 'AM';
        
    if (hh > 12) {
      hh = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      hh = 12;
      ampm = 'PM';
    } else if (hh == 0) {
      hh = 12;
    }
    
    // ie: 2013-02-18, 8:35 AM	
    const time = hh + ':' + min + ' ' + ampm;
      
    return time;
  }

}

