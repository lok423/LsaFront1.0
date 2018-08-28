import { Component,  OnInit,  Input, Inject, OnDestroy} from '@angular/core';
import { RepositoryService} from '../../../../services/repositories/repository.service';
import { UserService} from '../../../../services/servercalls/user.service';
import { CommonSupportService } from '../../../../services/support/common-support.service';
import { ProfileHelperService} from '../../../../services/helpers/profile-helper.service';
import { environment} from '../../../../../environments/environment.prod';
import { MatDialog,  MatDialogRef} from '@angular/material';
import { ImageEditorDialogComponent} from '../../../support/image-editor-dialog/image-editor-dialog.component';
import { DomSanitizer,  SafeResourceUrl,  SafeUrl, Title } from '@angular/platform-browser';
import { ConstantPool } from '../../../../../../node_modules/@angular/compiler/src/constant_pool';
import { Subscription } from '../../../../../../node_modules/rxjs';
import { isEmpty } from '../../../../../../node_modules/rxjs/operators';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home-panel.component.html',
  styleUrls: ['./dashboard-home-panel.component.css']
})

export class DashboardHomePanelComponent implements OnInit, OnDestroy {
  uRole: number;
  helpers: ({
    destination: string;main: string;
  })[];
  userInfo: Object;
  applyInfo: Object;
  tutorInfo: Object;
  sessions: any;
  user_profile_photo: string;
  image_change = false;
  baseImgUrl = environment.baseUserImgUrl + '/userimg/';

  userRepositoryService: Subscription;

  constructor(
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
    private repositoryService: RepositoryService,
    private helperService: ProfileHelperService,
    private UserService: UserService,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private titleService: Title,

    private commonSupportService: CommonSupportService
  ) {
    this.titleService.setTitle('Dashboard');
    this.uRole = this.repositoryService.uR
    this.helperService.getHelpers(this.uRole)
  }

  ngOnInit() {
    this.dataInit();
  }

  dataInit() {
    this.repositoryService.currentUserData();
    this.userRepositoryService = this.repositoryService.userInfo.subscribe(
      (res) => {// console.log(res);
        if (res.hasOwnProperty("user_id")) {
          this.userInfo = res;
          if (this.userInfo['user_profile_photo']) {
            let ver = new Date().getTime();
            // console.log("timestamp for ver is: " + ver);
            // console.log(this.baseImgUrl + this.userInfo['user_profile_photo']);
            // console.log(this.userInfo['user_profile_photo']);
            // try {
            //   this.user_profile_photo = this.baseImgUrl + this.userInfo['user_profile_photo'] + "?ver=" + ver;
            // } catch(err) {
            //   console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            //   console.log(err);
            // }
            // this.user_profile_photo = this.baseImgUrl + this.userInfo['user_profile_photo'] + "?ver=" + ver;
            this.user_profile_photo = this.commonSupportService.prepareUserImgUrl() + "?ver=" + ver;
          } else {
            this.user_profile_photo = '../../../../assets/default_pics/default-cp.jpg';
          }
        }
      }, (error) => console.log(error)
    );

    if (this.uRole == 1) {  }
    if (this.uRole == 2) {
      this.repositoryService.applicantInfo.subscribe(
        (res) => {
          console.log(res), this.applyInfo = res
        })
    }
    if (this.uRole == 3) {
      this.repositoryService.tutorInfo.subscribe(
        (res) => {
          this.tutorInfo = res, console.log(this.tutorInfo)
        })
    }

    this.helperService.helper.subscribe((e) => {
        console.log(e), this.helpers = e
      }
    );
  }


  // When click img or link, edit img dialog pop-up
  imgDialog() {
    let dialogRef = this.dialog.open(ImageEditorDialogComponent, {
      panelClass: 'dialog1',
      data: [2 / 2, this.user_profile_photo],
    });
    dialogRef.afterClosed().subscribe(
      (res) => {// console.log(res);
        if (res) {
          this.user_profile_photo = res;
          this.image_change = true;

          // convert base64 image to blob type
            fetch(this.user_profile_photo).then(
              (res) => res.blob()).then(
              (blob) => {
                this.userInfo['user_profile_photo'] = blob;
                // append blob type to formData
                let imgFormData = new FormData();
                for (let key in this.userInfo) {
                  if (key == "user_profile_photo") {
                    imgFormData.append("image", this.userInfo[key], 'test.jpeg');
                  }
                  else {
                    imgFormData.append(key, this.userInfo[key]);
                  }
                }
                this.UserService.updateUserPhoto(imgFormData).subscribe(
                  (res) => console.log(res),
                  (err) => console.log(err), )
              }
            )
        }
      }, (err) => console.warn(err)
    );
  }

  ngAfterViewInit() {}
  ngOnDestroy(): void {
    this.repositoryService.testEmptySub();
    this.userRepositoryService.unsubscribe();
  }

  receiveMessage($event) {
    this.sessions = $event;
  }
}
