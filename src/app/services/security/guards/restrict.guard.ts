import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../../../fcomponents/basic/login/login.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class RestrictGuard implements CanActivate {
  dialogRef: MatDialogRef<LoginComponent>;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
    private auth: AuthService, 
    private router: Router,
    private dialog: MatDialog,
  ) {}

  canActivate(): boolean{
    if (isPlatformBrowser(this.platformId)) {
      if(!this.auth.getAuth()){
        let dialogRef = this.dialog.open(LoginComponent, {
          width: '700px',
        });
        return false;
      } else {
        return true;
      }
    }
    else{
      return true;
    }
  }
}