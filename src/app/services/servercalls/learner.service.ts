import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  headers1: HttpHeaders;
  id: string;
  baseUrl = environment.baseUrl;

  constructor(
    @Inject(LOCAL_STORAGE) 
    private localStorage: any, 
    private http:HttpClient) {
    this.id = localStorage.getItem('lsaUserId');
    this.headers1= new HttpHeaders({'Authorization': "Bearer "+localStorage.getItem('lsaToken_access')});
   }

   // Learner Profile
   showLearnerProfile(){
    return this.http.get(this.baseUrl + '/learnerprofile/' + this.id , { headers: this.headers1 });
   }

   updateLearnerProfile(ee) {
    return this.http.put(this.baseUrl + '/learnerprofile/' + this.id, ee, { headers: this.headers1 });
   }

   // Learner Resources
  indexLearnerResources() {
    return this.http.get(this.baseUrl + '/learners/' + this.id + '/resources?hw=0', { headers: this.headers1 });
  }

  indexLearnerPublicResources() {
    return this.http.get(this.baseUrl + '/learners/' + this.id + '/resources?hw=1', { headers: this.headers1 });
  }

  showLearnerResource(resourceId){
    return this.http.get(this.baseUrl + '/learners/' + this.id + '/resources/' + resourceId, { headers: this.headers1 });
  }

   updateLearnerResourceResult(){

   }

   // Learner Sessions
   storeLearnerSessions(tutorId, bookings){
    return this.http.post(this.baseUrl+'/learners/'+this.id+'/tutors/'+tutorId+'/sessions', bookings, {headers: this.headers1});
   }

   updateLearnerSessions(objects){
    return this.http.put(this.baseUrl + '/learnersessions/' + this.id , objects, {headers: this.headers1});
   }

  //  indexLearnerSessions(conditions){
  //   return this.http.get(this.baseUrl+'/learners/'+this.id+'/sessions?'+'start'+conditions[0]+ '&end' + conditions[1], {headers: this.headers1});
  //  }
   indexLearnerSessions(searchValue) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.baseUrl + '/learners/' + this.id + '/sessions?' + 'start=' + searchValue[0] + '&end=' + searchValue[1], { headers: this.headers1 });
   }
   updateLearnerSessionStatus(sessionId, sessionValues) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.baseUrl + '/learners/' + this.id + '/sessions/' + sessionId + '/status', sessionValues, { headers: this.headers1 });
  }

  updateLearnerSessionTimelocation(sessionId, sessionValues) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.baseUrl + '/learners/' + this.id + '/sessions/' + sessionId + '/timelocation', sessionValues, { headers: this.headers1 });
  }

   // Learner See Tutor
  indexTutor(queryParams: string) {
    return this.http.get(this.baseUrl + '/learners/' +  this.id + '/tutors?' + 'tut=' + queryParams, {headers: this.headers1} );
  }

  showTutor(id:string){
    return this.http.get(this.baseUrl+'/findtutors/'+id);
  }


}
