import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ElementRef , Inject} from '@angular/core';
import { Validators,FormGroup, FormControl, FormBuilder, FormControlName } from '@angular/forms';
import { TutorService } from '../../../../../services/servercalls/tutor.service';
import { SideHelperService } from '../../../../../services/helpers/side-helper.service';

@Component({
  selector: 'app-tut-profile-edit-special',
  templateUrl: './tut-profile-edit-special.component.html',
  styleUrls: ['./tut-profile-edit-special.component.css']
})
export class TutProfileEditSpecialComponent implements OnInit {
  tutorprofile={age:[],  lesson:[], course:[], test:[],};   //for display
  tutor={sp_ages:[], sp_test_prep:[], sp_lesson_structure:[], sp_course_focus:[], '_method':'put',};   //for sent to server
  agForm: FormGroup;  testForm: FormGroup;  leForm: FormGroup;  coForm: FormGroup;       //define form
  agStatus=false;   testStatus=false;   leStatus=false;   coStatus=false;          //form status
  spIndex=['var0','var1','var2','var3','var4','var5','var6','var7','var8','var9'];
  agIndex=['Primary(5-10)','Intermediate(10-13)','High School(13-18)','Adult(18-)'];              //define data
  testIndex=['NCEA (University Entrance)','NCEA (Scholarship)','Cambridge (CIE)','IB','IELTS','SAT','TOEFL','LSAT','GMAT','GRE'];

  constructor(@Inject(WINDOW) private window: Window, 
    private builder: FormBuilder,
    private tutorService:TutorService,
    private SideHelperService: SideHelperService,
    private elem:ElementRef
  ) { }

  ngOnInit() {
    this.agForm = this.builder.group({ 'Primary(5-10)':['',],  'Intermediate(10-13)':['',],  'High School(13-18)':['',],  'Adult(18-)':['',]})
    this.testForm = this.builder.group({ 'NCEA (University Entrance)':['',], 'NCEA (Scholarship)':['',], 'Cambridge (CIE)':['',], 'IB':['',], 'IELTS':['',], 'SAT':['',], 'TOEFL':['',], 'LSAT':['',], 'GMAT':['',], 'GRE':['',]})
    console.log(this.agForm);
    this.tutorService.showTutorProfile().subscribe(
      (res)=>{
        this.tutorprofile = res['dataCon'].tutorProfile
        let x=res['dataCon'].tutorProfile.sp_ages;    if(x){this.tutorprofile.age = x;}else{this.tutorprofile.age = []}; 
        let y=res['dataCon'].tutorProfile.sp_test_prep;   if(y){this.tutorprofile.test = y;}else{this.tutorprofile.test = []};
        let z=res['dataCon'].tutorProfile.sp_lesson_structure;    if(z){this.tutorprofile.lesson=z;}else{this.tutorprofile.lesson = []};
        let w=res['dataCon'].tutorProfile.sp_course_focus;    if(w){this.tutorprofile.course=w;}else{this.tutorprofile.course = []};
        console.log(res['dataCon'].tutorProfile);
        console.log(this.tutorprofile);
        this.form();},
      (error)=>console.log(error))
  }//create test & agegroup  and  set tutorprofile value for display
  
  
  form(){
    this.leForm = this.builder.group({
      var0:[this.tutorprofile.lesson[0],Validators.minLength(2)], var1:[this.tutorprofile.lesson[1],Validators.minLength(2)], var2:[this.tutorprofile.lesson[2],Validators.minLength(2)], var3:[this.tutorprofile.lesson[3],Validators.minLength(2)], var4:[this.tutorprofile.lesson[4],Validators.minLength(2)],
      var5:[this.tutorprofile.lesson[5],Validators.minLength(2)], var6:[this.tutorprofile.lesson[6],Validators.minLength(2)], var7:[this.tutorprofile.lesson[7],Validators.minLength(2)], var8:[this.tutorprofile.lesson[8],Validators.minLength(2)], var9:[this.tutorprofile.lesson[9],Validators.minLength(2)],});
    this.coForm = this.builder.group({
      var0:[this.tutorprofile.course[0],Validators.minLength(2)], var1:[this.tutorprofile.course[1],Validators.minLength(2)], var2:[this.tutorprofile.course[2],Validators.minLength(2)], var3:[this.tutorprofile.course[3],Validators.minLength(2)], var4:[this.tutorprofile.course[4],Validators.minLength(2)],
      var5:[this.tutorprofile.course[5],Validators.minLength(2)], var6:[this.tutorprofile.course[6],Validators.minLength(2)], var7:[this.tutorprofile.course[7],Validators.minLength(2)], var8:[this.tutorprofile.course[8],Validators.minLength(2)], var9:[this.tutorprofile.course[9],Validators.minLength(2)],});
  }//create lesson & course form after the subcribe finish

  defCheck(y){
    let checkboxes = this.elem.nativeElement.querySelectorAll('input[type="checkbox"]');
    let checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
    if(checkedOne && this[y.name].dirty){
      let ag=[];
      this[y.index].forEach(res=>{
        if(this[y.name].value[res]){ag.push(res)};})
      this.tutorprofile[y.type]=ag;
      console.log('yes',ag);
      return this[y.status]=false;
    }else{console.log('no');}
  }//tempararily define the test & agegroup object in ts

  defineV(y){
    if(this[y.name].valid && this[y.name].dirty){
      for (var i=0;i<10;i++){ 
        let x=this[y.name].value[this.spIndex[i]];
        if(x||x==''){this.tutorprofile[y.index][i]=x};
      }
      console.log(this[y.name].value);
      return this[y.status]=false;
    }else{console.log('no');}
  }//tempararily define the lesson & course object in ts

  inputStatus(x){
    for (var i=0;i<9;i++){ 
      if(x.value[this.spIndex[i]]!=null&&x.value[this.spIndex[i+1]]==null){
        x.controls[this.spIndex[i+1]].setValue('');break;}}
  }//make the "input" in form appear when user click "Add another" button

  submitInfo(){  
    let item=['',null,"",];
    item.forEach(x=>{
      for (var i=0;i<10;i++){ 
      let index1=this.tutorprofile.lesson.indexOf(x);
      let index2=this.tutorprofile.course.indexOf(x);
      if (index1 !== -1) this.tutorprofile.lesson.splice(index1, 1);
      if (index2 !== -1) this.tutorprofile.course.splice(index2, 1);}
    })
    this.tutor.sp_ages=this.tutorprofile.age;
    this.tutor.sp_test_prep=this.tutorprofile.test;
    this.tutor.sp_lesson_structure=this.tutorprofile.lesson
    this.tutor.sp_course_focus=this.tutorprofile.course
    console.log(this.tutor)
    this.tutorService.updateTutorProfile(this.tutor).subscribe(
      (res)=>{console.log(res); 
         this.window.location.reload();},
      (error)=>console.log(error))
  }// after test,agegroup,lesson & course object send these objects to server

  cancelInfo(){this.window.location.reload();}//reload the page to destroy the tempararily defined objcts

  mouseEnter(m) {
    this.SideHelperService.sendMessage(m);
  }
}