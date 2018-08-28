import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class AccessTutorGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    private auth: AuthService, 
    private router: Router,
  ) {}

  canActivate(): boolean{
    if (isPlatformBrowser(this.platformId)) {
      if(this.auth.getUserRole()== 3){
          return true;
      } else {
        this.router.navigate(['/app/dashboard/home']);
          return false;
      }
    }
  }
}
