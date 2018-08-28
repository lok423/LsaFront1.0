import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.css']
})
export class HelpPanelComponent implements OnInit {

  currentRoutePosition:string
  isBrowser=false
  
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    public router: Router,
    public route: ActivatedRoute,

  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
   }
  }

  ngOnInit() {
    console.log(this.router.url)
    if(this.router.url == '/app/help/applicants'){
      this.currentRoutePosition = '/ for applicant'
    }
    if(this.router.url == '/app/help/teachers'){
      this.currentRoutePosition = '/ for teachers'
    }
    if(this.router.url == '/app/help/students'){
      this.currentRoutePosition = '/ for students'
    }
  }
}