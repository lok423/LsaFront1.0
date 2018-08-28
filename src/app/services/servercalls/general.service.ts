import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  'rxjs/add/operator/map';
import { SearchTutorModel } from '../../models/SearchTutorModel';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class GeneralService {
  baseUrl = environment.baseUrl;

  constructor(
    public http:HttpClient,
   ) {
  }

  // Find Tutor
  indexTutors(searchValue){
    return this.http.get(this.baseUrl+'/findtutors?'+'subject='+searchValue[0]+'&location='+searchValue[1]);
  }

  showTutor(id:string){
    return this.http.get(this.baseUrl+'/findtutors/'+id);
  }

  // Posts
  indexAllPosts(type, subject, grade){
    return this.http.get(this.baseUrl+'/posts/'+'?type='+type+'&'+'subject='+subject+'&grade='+grade);
  }

  showPost(id:string){
    return this.http.get(this.baseUrl+'/posts/'+id);
  }

  indexDiscussions(){

  }
  
  showDiscussions(){

  }

  // Contact us forms
  storeContact(contactUs){
    return this.http.post(this.baseUrl+'/contacts', contactUs);
  }
}