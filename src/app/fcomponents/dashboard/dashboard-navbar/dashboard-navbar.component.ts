import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/security/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit, AfterViewChecked  {
  rolePosition: number;
  // status=true;
  show = false;
  Dashboard:string;
  screenStatus = false;
  collapseStatus = false;
  counter = 0;
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    @Inject(WINDOW) 
    private window: Window, 
    private authService:AuthService,
    private route: ActivatedRoute,
    private cdRef : ChangeDetectorRef,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
  }
  
  // onClick1(){
  //   this.status=!this.status;
  // }
  onClick2(x){
    this.Dashboard=x.name;
  }
  ngOnInit() {
    this.rolePosition = this.authService.getUserRole()
    this.Dashboard=this.route.snapshot.routeConfig.path;

    if(this.isBrowser){
      $(this.window).resize(() => {
        var w=this.window,
        e=document.documentElement,
        g=document.getElementsByTagName('body')[0],
        x=w.innerWidth||e.clientWidth||g.clientWidth;
        if (x < 768) { 
          this.screenStatus = true; 
          this.collapseStatus = false; 
        } else if (x >= 768 && x < 992) {
          this.screenStatus = false; 
          this.collapseStatus = true; 
        // when user is Applicant, make navbar content in the vertical middle position
          if (this.rolePosition === 2) {
            $('#dashboardHome').css({'padding-top': '0.5rem !important', 'padding-bottom': '0'});
            $('#tutorApplication').css({'padding-top': '0', 'padding-bottom': '0'});
            $('#myLessons').css({'padding-top': '0', 'padding-bottom': '0'});
            $('#myHomework').css({'padding-top': '0', 'padding-bottom': '0'});
            $('.learnerProfile').css({'padding-top': '0', 'padding-bottom': '0'});
          }
        } else if (x >= 992) { 
          this.screenStatus = false; 
          this.collapseStatus = true; 
          if (this.rolePosition === 2) {
            $('.nav-link').css({ 'padding-top': '8px', 'padding-bottom': '8px' });
          }
        }
      });
    }
  }

  // collapseStatus boolean value is false before and true afterwards
  ngAfterViewChecked() {
    let show = this.collapseContent();
    if (show != this.show) { // check if it change, tell CD update view
      this.show = show;
      this.cdRef.detectChanges();
    }
  }

  collapseContent(){
    if(this.isBrowser){
      if (this.counter < 1) {
        $(this.window).resize();
        this.counter += 1;
      }
    }
    return this.collapseStatus;
  }
}
