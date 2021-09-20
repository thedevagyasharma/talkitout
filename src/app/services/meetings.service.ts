import { Injectable } from '@angular/core';
import ZoomVideo, { VideoClient } from '@zoom/videosdk';


@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  localAudioTrack = ZoomVideo.createLocalAudioTrack();
  localVideoTrack = ZoomVideo.createLocalVideoTrack();
  vidClient = ZoomVideo.createClient();
  
  constructor() {}

}
