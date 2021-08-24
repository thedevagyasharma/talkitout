import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-startmeeting',
  templateUrl: './startmeeting.component.html',
  styleUrls: ['./startmeeting.component.scss']
})
export class StartmeetingComponent implements OnInit {

  constructor() { }
  camOn = false;

  ngOnInit(): void {
  }
  // VideoElement = new HTMLVideoElement();
  // vidbox : Element = document.getElementsByClassName("video-preview")[0];
  // this.vidbox = this.vidbox.append(this.VideoElement);
}
