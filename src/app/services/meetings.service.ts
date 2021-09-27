import { Time } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ZoomVideo, { VideoClient } from '@zoom/videosdk';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import { Observable } from 'rxjs';
import { Meeting } from '../shared/meeting.model'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  url: string = "http://localhost:3000/meetings"

  localAudioTrack = ZoomVideo.createLocalAudioTrack();
  localVideoTrack = ZoomVideo.createLocalVideoTrack();
  vidClient = ZoomVideo.createClient();
  
  constructor(private http:HttpClient) {}

  getMeeting(topic: string): Observable<Meeting[]>{
    return this.http.get<Meeting[]>(this.url + "?topic=" + topic);
  }

  postMeeting(topic: string, host: string, starttime: number): Observable<Meeting>{
    let meeting = new Meeting();
    meeting.host = host;
    meeting.topic = topic;
    meeting.starttime = starttime;
    return this.http.post<Meeting>(this.url, meeting, httpOptions);
  }

  deleteMeeting(id: number){
    return this.http.delete(this.url + "/" + id, httpOptions);
  }
}
