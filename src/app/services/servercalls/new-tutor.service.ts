import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ApplyTeachModel } from '../../models/ApplyTeachModel';
import { environment } from '../../../environments/environment.prod';
import { Inject } from '@angular/core';

@Injectable()
export class NewTutorService {
  headers1: HttpHeaders;
  id:string;
  baseUrl = environment.baseUrl;

  constructor(
    @Inject(LOCAL_STORAGE) 
    private localStorage: any, 
    private http:HttpClient
    ) 
  {
    this.id = localStorage.getItem('lsaUserId');
    this.headers1= new HttpHeaders({'Authorization': "Bearer "+localStorage.getItem('lsaToken_access')});
  }


  storeTutorApplication(aaa:Object ){
    return this.http.post(this.baseUrl+'/jobs/'+this.id+'/apply', aaa, {headers: this.headers1});
  }

  showTutorApplication(){
    return this.http.get(this.baseUrl+'/applyteach/'+this.id, {headers: this.headers1})
  }

  updateTutorApplication(bbb:Object){
    return this.http.post(this.baseUrl+'/applyteach/'+this.id, bbb, {headers: this.headers1})
  }

}