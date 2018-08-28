import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RepositoryService } from './../repositories/repository.service';

@Injectable()
export class ProfileHelperService {
  genU: {destination: string; main: string; }[];
  gen=[{destination:'',main:''}];
  ea:string;
  userR: number;
  helper=new BehaviorSubject<any>('');
  userRole = new BehaviorSubject<any>('');
  
  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.helper.asObservable();
   }

  getHelpers(uR) {
    this.userR = uR;
    if (this.userR === 1) {
      this.repositoryService.learnerInfo.subscribe(res => {
        this.students(res);
        this.userRole.next(1);
      });
    }
    if (this.userR === 2) {
      this.repositoryService.applicantInfo.subscribe(res=>this.applicants(res));
    }
    if (this.userR === 3) {
      this.repositoryService.tutorInfo.subscribe(res => {
        this.tutors(res);
        this.userRole.next(3);
      });
    }
    // tslint:disable-next-line:one-line
    else{
      return this.noRoles();
    }
  }

  students(data){
      if(data){
        this.gen=[{destination:"/app/find-tutor", main:"You have no teachers yet."}]
      }
      if(data){
        this.gen.push({destination:"", main:""})
      }
      this.helper.next(this.gen)
    }

  applicants(data){
    this.gen = [{ destination:"/app/dashboard/applicant/applyteach", main:"Thank you for applying to teach."}]
    if(data.condition=='update'){
      this.gen.push({destination:"/app/dashboard/applicant/applyteach", main:"Your application needs an update:"})
    }
    if(data.condition=='approved'){
      this.gen.push({destination:"/app/dashboard/applicant/applyteach", main:"Your application has been approved:"})
    }
    this.helper.next(this.gen)
  }

  tutors(data){
        setInterval(()=>{
          this.gen = [{destination:"/dfgfd/", main: "dfddddddddddddddddddddd."}]
          console.log(this.gen)
        }, 10000);

    if(data.publish==0){
      this.gen = [{destination:"/app/dashboard/tutor/editprofile/", main: "Your profile is incomplete, and had not yet been published."}]
    }
    if(data.publish==1){
      this.gen = [{destination:"/app/dashboard/tutor/editprofile", main: "Your profile have been published."}]
    }
    if(!data.profile_video){
      this.gen.push({destination:"/app/dashboard/tutor/editprofile/", main:"Update an video introduction for your profile."})
    }
    if(!data.edu_1 && !data.edu_2 && !data.edu_3){
      this.gen.push({destination:"/app/dashboard/tutor/editprofile/cv", main:"Add a education history to your profile"})
    }
    if(!data.hobby_1 && !data.hobby_2){
      this.gen.push({destination:"/app/dashboard/tutor/editprofile/cv", main:"Add a interest to your profile"})
    }
    this.genU=this.gen.slice(1,3)
    this.helper.next(this.genU)

  }

  noRoles(){
    this.gen = [{destination:"", main: "We can't reach anything for you at this moment."}]
    return this.gen
  }
}