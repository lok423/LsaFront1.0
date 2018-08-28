import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Component, OnInit, ElementRef , Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NewUserComponent } from '../../fcomponents/basic/newuser/newuser.component';
import { LoginComponent } from '../../fcomponents/basic/login/login.component';
import { AuthService } from '../../services/security/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CommonSupportService } from '../../services/support/common-support.service';

declare var $:any;

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  rolePosition: number;
  loggedInUserName: string;
  dialogRef: MatDialogRef<NewUserComponent, LoginComponent>;
  scroll: any;
  loggedIn = <boolean>false;
  navStatus = false;
  screenStatus = false;
  collapseStatus = false

  isBrowser;

  constructor(
    @Inject(PLATFORM_ID) 
    private platformId,
    @Inject(WINDOW)
    private window: Window, 
    @Inject(LOCAL_STORAGE) 
    private localStorage: any, 
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private elem: ElementRef,
    private commonSupport: CommonSupportService,
    private meta: Meta,
    private titleService: Title
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.meta.addTags([
      { name: 'keywords', content: 'apply to teach, teaching jobs, tutoring jobs, Learnspace, tutoring, tutor, maths tutor, english tutor, science tutor'},
      { name: 'description', content: 'Apply to teach at Learnspace' },
    ])
    this.titleService.setTitle('Learnspace | Apply Teach');
   } 

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      if (this.authService.getAuth()) {
        this.loggedIn = true
        this.loggedInUserName = localStorage.getItem('lsaUserName')
        this.rolePosition = this.authService.getUserRole()
      } else {
        this.loggedIn = false
      }
  
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

  newUser(){
    if(this.loggedIn){
      console.log('s')
      this.router.navigate(['/app/apply/teach']);
    }
    else{
      let dialogRef = this.dialog.open(NewUserComponent,
        {panelClass: 'dialog1'});
    }
  }

  loginUser($event) {
    let dialogRef = this.dialog.open(LoginComponent,
      { panelClass: 'dialog1' });
  }

  onLogoutClick() {
    this.authService.loggingOut();
  }

}
