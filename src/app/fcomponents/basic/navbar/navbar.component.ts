import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject, PLATFORM_ID } from '@angular/core';
import { NewUserComponent } from '../newuser/newuser.component';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/security/auth.service';
import { CommonSupportService } from '../../../services/support/common-support.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  isBrowser = false;
  rolePosition: number;
  dialogRef: MatDialogRef<NewUserComponent, LoginComponent>;
  loggedIn=<boolean>false
  loggedInUserName: string;

  userImg: string;

  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId,
    public dialog: MatDialog,
    private authService:AuthService,
    public router: Router,
    public route: ActivatedRoute,
    private commonSupport: CommonSupportService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
   }

  ngOnInit() {
    this.rolePosition = this.authService.getUserRole()

    if(this.authService.getAuth()){
      this.loggedIn = true;
      this.loggedInUserName = this.localStorage.getItem('lsaUserName');
      this.userImg = this.commonSupport.prepareUserImgUrl() + "?ver=" + this.commonSupport.getTime();
    }
    else {
      this.loggedIn = false
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
