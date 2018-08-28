import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { GeneralService } from '../../../services/servercalls/general.service';
import { SearchTutorModel } from '../../../models/SearchTutorModel';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

import { CommonSupportService } from '../../../services/support/common-support.service';

@Component({
  selector: 'app-find-main',
  templateUrl: './find-main.component.html',
  styleUrls: ['./find-main.component.css']
})

export class FindMainComponent implements OnInit {
  tutors:SearchTutorModel;
  searchInfo = 'We are getting your data now . . .'
  default_discipline:string;
  default_location='';
  discipline:string;
  location= this.default_location;
  f:string;
  isBrowser=false
  
  baseImgUrl = environment.baseImgUrl+'/tutorimg/';


  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    public searchService:GeneralService,
    public route: ActivatedRoute,

    private commonSupport: CommonSupportService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
  }

  ngOnInit() {
    if (this.route.snapshot.url[1]){
    this.default_discipline = this.route.snapshot.url[1].path;
    this.discipline = this.default_discipline
    } else {
      this.discipline = ''
    }
    this.searchTutor(this.discipline,this.location);
  }

  searchTutor(f,e){
    console.log(this.discipline, this.location)
    this.searchService.indexTutors([this.discipline, this.location]).subscribe(
      (data)=>this.dataLoop(data),
      (error)=>{this.searchInfo="Something went wrong. We'll be fixing it right away . . "}
    )
  }

  dataLoop(data){
    this.tutors=data['data'];
    if(!this.tutors.first_name){
      this.searchInfo="There are no tutors yet for this subject."
    }
  }
}
