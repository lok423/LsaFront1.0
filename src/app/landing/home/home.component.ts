import { LOCAL_STORAGE , WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ElementRef , Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NewUserComponent } from '../../fcomponents/basic/newuser/newuser.component';
import { LoginComponent } from '../../fcomponents/basic/login/login.component';
import { AuthService } from '../../services/security/auth.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { CommonSupportService } from '../../services/support/common-support.service';

declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rolePosition: number;
  loggedInUserName: string;
  dialogRef: MatDialogRef<NewUserComponent, LoginComponent>;
  scroll: any;
  loggedIn = <boolean>false;
  navStatus = false;
  screenStatus = false;
  collapseStatus = false

  isBrowser=false

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private dialog: MatDialog,
    private authService: AuthService,
    private elem: ElementRef,
    private commonSupport: CommonSupportService,
    private meta: Meta,
    private titleService: Title
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
    this.meta.addTags([
      { name: 'keywords', content: 'Tutoring, tutoring jobs, Learnspace, tutors, NCEA tutors, Maths tutors, English tutors, best maths tutors, best tutors'},
      { name: 'description', content: 'Learnspace Home, find the best high school tutors in Wellington and Auckland' }
    ])
    this.titleService.setTitle('Learnspace | Home');
   }

  ngOnInit() {
    if (this.authService.getAuth()){
      this.loggedIn = true
      this.loggedInUserName = localStorage.getItem('lsaUserName')
      this.rolePosition = this.authService.getUserRole()
    } else {
      this.loggedIn = false
    }

    if (this.isBrowser) {
      // Client only code.

      $(window).resize(() => {
        if ($(window).width() <= 768) { this.screenStatus = true }
        else { this.screenStatus = false }
      });

      $(window).scroll(() => {
        if ($(window).scrollTop() >= 60) { this.navStatus = true }
        else { this.navStatus = false }
      });
    }

  }

  collapseShow() {
    let navbar = this.elem.nativeElement.querySelector('#top-navbar');
    let itemLength = navbar.querySelectorAll('li').length;
    let collDisplay = this.elem.nativeElement.querySelector('#navbar-primary');
    collDisplay = collDisplay.className.toString();
    let isShow = collDisplay.indexOf('collapse show');
    if (isShow == -1) {
      this.screenStatus = true;
      this.collapseStatus = true;
    } else {
      this.screenStatus = false;
      this.collapseStatus = false;
    }
  }

  newUser($event){
    let dialogRef = this.dialog.open(NewUserComponent,
      {panelClass: 'dialog1'});
  }

  loginUser($event){
    let dialogRef = this.dialog.open(LoginComponent,
      {panelClass: 'dialog1'});
  }

  onLogoutClick(){
    this.authService.loggingOut();
  }
}