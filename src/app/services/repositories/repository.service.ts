import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../servercalls/user.service';
import { AuthService } from '../security/auth.service';
import { NewTutorService } from '../servercalls/new-tutor.service';
import { TutorService } from '../servercalls/tutor.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class RepositoryService {
  userData=new BehaviorSubject<any>('');
  tutorData=new BehaviorSubject<any>('');
  applicantData=new BehaviorSubject<any>('');
  learnerData=new BehaviorSubject<any>('');
  userPostsData=new BehaviorSubject<any>('');

  combinedUser:Object;
  combinedTutor:Object;
  applyData:Object;
  uR: number;
  applicantInfo:Observable<object>;
  userInfo:Observable<object>
  tutorInfo:Observable<object>;
  learnerInfo:Observable<Object>
  thisUserPosts:Observable<Object>
  isBrowser = false

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    
    private userService:UserService,
    private authService:AuthService,
    private newTutorService:NewTutorService,
    private tutorService:TutorService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }

    this.uR=this.authService.getUserRole()
    if(this.isBrowser){
      this.userSpData()
      this.sessionUserData()
    }

    this.applicantInfo=this.applicantData.asObservable();
    this.userInfo=this.userData.asObservable();
    this.tutorInfo=this.tutorData.asObservable();
    this.learnerInfo=this.learnerData.asObservable();
    this.thisUserPosts=this.userPostsData.asObservable();
   }
   userSpData(){
    if(this.uR==1){
      this.currentLearnerData()
      }
    if(this.uR==2){
      this.sessionApplicantData()
      }
    if(this.uR==3){
      this.sessionTutorData()
      }
    }

    sessionLearnerData(){

    }

    currentLearnerData(){

    }

    // Gather Applicant Specific Data
   sessionApplicantData(){
    if(this.isBrowser){
      let aInfo = JSON.parse(sessionStorage.getItem('lsaSpApplicantInfo'));
      if(!aInfo){this.currentApplicantData()}
      else{
        this.applicantData.next(aInfo)
      }
    }
  }

   currentApplicantData(){
    return this.newTutorService.showTutorApplication().subscribe(
      (res)=>{this.applyData=res['dataCon'].applyInfo, this.applicantData.next(this.applyData), this.saveApplicantSession(this.applyData)},
      (error)=>console.log(error)
    )
   }

   // Gather Tutor Specific Data
   sessionTutorData(){
    if(this.isBrowser){
      let tInfo = JSON.parse(sessionStorage.getItem('lsaSpTutorInfo'));
      let tProf = JSON.parse(sessionStorage.getItem('lsaSpTutorProfile'));
      if(!tInfo||!tProf){this.currentTutorData()}
      else{
        this.combinedTutor = Object.assign(tInfo,tProf);
        this.tutorData.next(this.combinedTutor);
      }
    }
  }

   currentTutorData(){
     this.tutorService.showTutorProfile().subscribe(
       (res)=>{
         this.combinedTutor=Object.assign(res['dataCon'].tutorInfo, res['dataCon'].tutorProfile,  )
         this.tutorData.next(this.combinedTutor)
         this.saveTutorSession(res)
        },
       (error)=>console.warn(error)
     )
   }
   // Gather User Specific Data
   sessionUserData(){
    if(this.isBrowser){
      let uKeys = JSON.parse(sessionStorage.getItem('lsaUserskeys'));
      let uInfo = JSON.parse(sessionStorage.getItem('lsaUsersInfo'));
      if(!uKeys||!uInfo){this.currentUserData()}
      else{
        // console.log('See how many times this gets fired')
        this.combinedUser = Object.assign(uKeys,uInfo);
        this.userData.next(this.combinedUser)
      };
    }
   }

   currentUserData(){
    this.userService.showUserInfo().subscribe(
     (res)=>{
       this.saveUserSession(res)
       this.combinedUser=Object.assign(res['dataCon'].userBasic, res['dataCon'].userSecondary),
       this.userData.next(this.combinedUser)
     },
     (error)=>console.log(error)
   );
  }

  testEmptySub() {
    this.userData.next({});
  }

  // Save as sessions
  saveApplicantSession(res){
    sessionStorage.setItem('lsaSpApplicantInfo', JSON.stringify(res['dataCon'].applyInfo));
  }

  saveUserSession(res){
    sessionStorage.setItem('lsaUserskeys', JSON.stringify(res['dataCon'].userBasic));
    sessionStorage.setItem('lsaUsersInfo', JSON.stringify(res['dataCon'].userSecondary));
  }

  saveTutorSession(res){
    sessionStorage.setItem('lsaSpTutorInfo', JSON.stringify(res['dataCon'].tutorInfo));
    sessionStorage.setItem('lsaSpTutorProfile', JSON.stringify(res['dataCon'].tutorProfile));
  }

  saveLearnerSession(){

  }

  // Determines what kind of posts to get user
  userPostPreference(){

  }

  // Getting the posts

}
