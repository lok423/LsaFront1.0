import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { Validators,FormGroup, FormControl, FormBuilder, FormControlName } from '@angular/forms';
import { TutorService } from '../../../../../services/servercalls/tutor.service';
import { SideHelperService } from '../../../../../services/helpers/side-helper.service';


@Component({
  selector: 'app-tut-profile-edit-cv',
  templateUrl: './tut-profile-edit-cv.component.html',
  styleUrls: ['./tut-profile-edit-cv.component.css']
})

export class TutProfileEditCvComponent implements OnInit {
  tProfile: any;
  Profile={"quote":null,"quote_author":null,"edu_1":null,"edu_1_detail":null,"edu_1_date":null,"edu_2":null,"edu_2_detail":null,"edu_2_date":null,"edu_3":null,"edu_3_detail":null,"edu_3_date":null,"work_1":null,"work_1_detail":null,"work_1_date":null,"work_2":null,"work_2_detail":null,"work_2_date":null,"work_3":null,"work_3_detail":null,"work_3_date":null,"hobby_1":null,"hobby_1_detail":null,"hobby_2":null,"hobby_2_detail":null};
  oProfile: any;//original tprofile info
  tutor: any;
  statuses: any;
  forms: any;
  details: any;
  names: any;
  sYears: any;
  eYears: any;
  titles: any;
  years: any;
  description: any;

  e1Status=false; e2Status=false; e3Status=false;
  w1Status=false; w2Status=false; w3Status=false;
  h1Status=false; h2Status=false;
  qStatus=false;
  edu1Form: FormGroup;  edu2Form: FormGroup;  edu3Form: FormGroup;
  work1Form: FormGroup; work2Form: FormGroup; work3Form: FormGroup;
  hobby1Form: FormGroup;  hobby2Form: FormGroup;
  quoteForm: FormGroup;
  // Profile:{} // sent data
  // tProfile={} // initial data
  constructor(@Inject(WINDOW) private window: Window, 
    private builder: FormBuilder,    
    private tutorService:TutorService,
    private SideHelperService: SideHelperService,

  ) { }

  ngOnInit() {
    this.tutorService.showTutorProfile().subscribe(
      (res)=>{console.log(res);this.tProfile = Object.assign(res['dataCon'].tutorProfile);this.oProfile=this.tProfile;console.log(this.tProfile)},
      (error)=>console.log(error)
    )

      this.edu1Form = this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],    eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.edu2Form=this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],  eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.edu3Form=this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],     eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],    eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.work1Form= this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],    eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.work2Form= this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],    eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.work3Form= this.builder.group({
        edu :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],
        sYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],    eYear :['',[Validators.required,Validators.min(1950),Validators.max(2018)]],});
      this.hobby1Form= this.builder.group({
        hobby :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],});
      this.hobby2Form= this.builder.group({
        hobby :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],});
      this.quoteForm= this.builder.group({
        hobby :['',[Validators.required,Validators.minLength(2)]],    eDetail :['',[Validators.required,Validators.minLength(3)]],});    
  
  }


  eduWork(x) {
    if(this[x.form].valid && this[x.form].dirty){
      this.Profile[x.title]=this[x.form].value.edu;
      this.Profile[x.des]=this[x.form].value.eDetail;
      this.Profile[x.year]=this[x.form].value.sYear+' - '+this[x.form].value.eYear;
      this.tProfile[x.title]=this.Profile[x.title];
      this.tProfile[x.des]=this.Profile[x.des];
      this.tProfile[x.year]=this.Profile[x.year];
      console.log('valid',this.Profile);
      return this[x.status]=false;
    }else{
      console.log('not valid', this.Profile);
    }
  }

  quoHobby(x){
    if(this[x.form].valid && this[x.form].dirty){
      this.Profile[x.title]=this[x.form].value.hobby;
      this.Profile[x.des]=this[x.form].value.eDetail;
      this.tProfile[x.title]=this.Profile[x.title];
      this.tProfile[x.des]=this.Profile[x.des];
      console.log('valid',this.Profile);
      return this[x.status]=false;
    }else{
      console.log('not valid', this.Profile);
    }
  }

  dlEduWork(x) {
    this.Profile[x.title]=' ';
    this.Profile[x.des]=' ';
    this.Profile[x.year]=' ';
    this.tProfile[x.title]='';
    this.tProfile[x.des]='';
    this.tProfile[x.year]='';
    console.log('half',this.Profile);
  }

  dlQuoHobby(x) {
    this.Profile[x.des]=' ';
    this.Profile[x.title]=' ';
    this.tProfile[x.title]='';
    this.tProfile[x.des]='';
    console.log('half',this.Profile);
  }

  submitInfo(){
    if(this.Profile['edu_1']|| this.Profile['edu_1']=='' || this.Profile['edu_2'] || this.Profile['edu_2']=='' ||  this.Profile['edu_3'] ||  this.Profile['edu_3']=='' || this.Profile['work_1'] || this.Profile['work_1']=='' || this.Profile['work_2'] || this.Profile['work_2']=='' || 
    this.Profile['work_3'] || this.Profile['work_3']=='' || this.Profile['hobby_1'] || this.Profile['hobby_1']=='' || this.Profile['hobby_2'] || this.Profile['hobby_2']=='' || this.Profile['quote'] || this.Profile['quote']==''){
      this.Profile['_method']='put';
      Object.keys(this.Profile).forEach(k => (!this.Profile[k] && this.Profile[k] !== undefined) && delete this.Profile[k]);
      console.log(this.Profile) 
      this.tutorService.updateTutorProfile(this.Profile).subscribe(
        (res)=>{console.log(res);
                // window.location.reload();
              },
        (error)=>console.log(error)
      )
    }
    else{
      console.log('No Values defined')
    }
  }

  cancelInfo(){
    this.window.location.reload();
  }

  mouseEnter(m) {
    this.SideHelperService.sendMessage(m);
  }

}
