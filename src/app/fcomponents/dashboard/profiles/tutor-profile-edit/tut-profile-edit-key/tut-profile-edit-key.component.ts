import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators,FormGroup, FormControl, FormBuilder, FormControlName } from '@angular/forms';
import { TutorService } from '../../../../../services/servercalls/tutor.service';
import { ImageEditorDialogComponent } from '../../../../support/image-editor-dialog/image-editor-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../../../environments/environment.prod';
import { SideHelperService } from '../../../../../services/helpers/side-helper.service';
import { CommonSupportService } from '../../../../../services/support/common-support.service';

@Component({
  selector: 'app-tut-profile-edit-key',
  templateUrl: './tut-profile-edit-key.component.html',
  styleUrls: ['./tut-profile-edit-key.component.css']
})
export class TutProfileEditKeyComponent implements OnInit {
  stateForm: FormGroup;
  LocationForm0: FormGroup;
  LocationForm1: FormGroup;
  LocationForm2: FormGroup;
  LocationForm3: FormGroup;
  locationForms=[];
  teaching_locations=[];
  numbers=[0,1,2];
  spIndex=['locationForm0','locationForm1','locationForm2'];
  tutor={
    profile_photo:'',
    intro_statement:'',
    teaching_locations:[
      {city:'',suburb:'',street:'',number:''},
      {city:'',suburb:'',street:'',number:''},
      {city:'',suburb:'',street:'',number:''},
      {city:'',suburb:'',street:'',number:''}
    ]}
  errorMessage: string;
  errorMessage2:string;
  errorMessage3: string;
  formData=new FormData();
  locationStatus=[false,false,false,false]; //locationForm status
  Profile={ intro_statement:'',  _method:''}; // sent data
  dialogRef: MatDialogRef<ImageEditorDialogComponent>;
  profile_photo: string;
  baseImgUrl = environment.baseImgUrl+'/tutorimg/';
  loFeedback: string;
  stStatus=false;

  constructor(
    private elem: ElementRef,
    private builder: FormBuilder,
    private tutorService: TutorService,
    private SideHelperService: SideHelperService,
    private dialog: MatDialog,
    private commonSupport: CommonSupportService
  ) { }

  ngOnInit() {
    this.tutorService.showTutorProfile().subscribe(
      (res) => {console.log(res);this.setFormValues(res)},
      (error) => {console.log('no'), this.errorMessage="Sorry, but we can't get your data at this time."}
    )
  }
  //define the reactive form
  form(){
    this.stateForm = this.builder.group({state :['',[Validators.minLength(20),Validators.maxLength(3000)],] });
    this.LocationForm0 = this.builder.group({
      city:[this.tutor.teaching_locations[0].city,[Validators.required,Validators.minLength(3)]],
      suburb:[this.tutor.teaching_locations[0].suburb,[Validators.required,Validators.minLength(3)]],
      street:[this.tutor.teaching_locations[0].street,[Validators.required,Validators.minLength(3)]],
      number:[this.tutor.teaching_locations[0].number,[Validators.required,Validators.minLength(1)]]
    });
    this.LocationForm1 = this.builder.group({
      city:[this.tutor.teaching_locations[1].city,[Validators.required,Validators.minLength(3)]],
      suburb:[this.tutor.teaching_locations[1].suburb,[Validators.required,Validators.minLength(3)]],
      street:[this.tutor.teaching_locations[1].street,[Validators.required,Validators.minLength(3)]],
      number:[this.tutor.teaching_locations[1].number,[Validators.required,Validators.minLength(1)]]
    });
    this.LocationForm2 = this.builder.group({
      city:[this.tutor.teaching_locations[2].city,[Validators.required,Validators.minLength(3)]],
      suburb:[this.tutor.teaching_locations[2].suburb,[Validators.required,Validators.minLength(3)]],
      street:[this.tutor.teaching_locations[2].street,[Validators.required,Validators.minLength(3)]],
      number:[this.tutor.teaching_locations[2].number,[Validators.required,Validators.minLength(1)]]
    });
    this.LocationForm3 = this.builder.group({
      city:[this.tutor.teaching_locations[3].city,[Validators.required,Validators.minLength(3)]],
      suburb:[this.tutor.teaching_locations[3].suburb,[Validators.required,Validators.minLength(3)]],
      street:[this.tutor.teaching_locations[3].street,[Validators.required,Validators.minLength(3)]],
      number:[this.tutor.teaching_locations[3].number,[Validators.required,Validators.minLength(1)]]
    });
    this.locationForms.push(this.LocationForm0,this.LocationForm1,this.LocationForm2,this.LocationForm3);
    console.log(this.locationForms[3]);
  }

  setFormValues(data){
    this.tutor.profile_photo=data['dataCon'].tutorInfo.profile_photo;
    this.tutor.intro_statement=data['dataCon'].tutorInfo.intro_statement;
    let locate=data['dataCon'].tutorProfile.teaching_locations;
    for(let i=0; i<locate.length; i++){
      let lo=this.tutor.teaching_locations[i]
      let temp=locate[i].split(',');
      if(temp[0]){lo.number=temp[0]};
      if(temp[1]){lo.street=temp[1]};
      if(temp[2]){lo.suburb=temp[2]};
      if(temp[3]){lo.city=temp[3]};
    }
    console.log(this.tutor.teaching_locations);
    this.form();
    console.log(this.tutor)
    if(!this.tutor.profile_photo){
      this.profile_photo = "../../../../assets/default_pics/default-cp.jpg"
    }
    else{
      this.profile_photo = this.commonSupport.prepareUserImage(this.tutor.profile_photo);
      // this.profile_photo = this.baseImgUrl+this.tutor.profile_photo
    }
  }
  //change the location forms' status
  loStatus(){
    let locate= this.tutor.teaching_locations;
    for(let i=0; i<locate.length-1; i++){
      if(locate[i].city!==''&&locate[i+1].city===''){
        return this.locationStatus[i+1]=true;
      }
    }
  }
  //set the location form data and subscibe
  setData(){
    this.teaching_locations=[];
    for(let lo of this.locationForms){
      let x={city:'',suburb:'',street:'',number:''};
      if(lo.value.city!=''){
        x.city=lo.value.city;
        x.suburb=lo.value.suburb;
        x.street=lo.value.street;
        x.number=lo.value.number;
        this.teaching_locations.push(x);
      }
    }
    let locate=this.teaching_locations;
    for(let i=0; i<locate.length; i++){   this.tutor.teaching_locations[i]=locate[i];   }
    for(let i=locate.length; i<4; i++){
      let x={city:'',suburb:'',street:'',number:''};
      this.tutor.teaching_locations[i]=x;
    }
    let sent={teaching_locations:[]};
    for(let i=0; i<this.teaching_locations.length; i++){
      let lo=this.teaching_locations[i];
      let text='';
      text=text+lo.number+','+lo.street+','+lo.suburb+','+lo.city;
      sent['_method'] = 'put';
      sent.teaching_locations.push(text);
    }
      this.tutorService.updateTutorProfile(sent).subscribe(
        (res) => {console.log(res);},
        (err) => {console.log(err), this.errorMessage3="Sorry, but something has gone wrong with our computers :(  "}
      )
  }

  submitLocations(y){
    console.log(y.name);
    if(y.name.valid){
      console.log(this.locationForms)
      this.setData();
      this.loFeedback=null;
      return this.locationStatus[y.index]=false;
    }else{
      this.loFeedback="Sorry, you need fulfill all fields."
      console.log('no')
    }
  }

  DeleteForm(index){
    console.log(this.locationForms[index].value);
    console.log(this.locationForms);
    this.locationForms[index].controls.city.setValue('');
    this.locationForms[index].controls.suburb.setValue('');
    this.locationForms[index].controls.street.setValue('');
    this.locationForms[index].controls.number.setValue('');
    for(let i=0; i<3; i++){
      if(this.locationForms[i].value.city.length===0){
        for(let j=3; j>i; j--){
          if(this.locationForms[j].value.city.length>0){
            let x=this.locationForms[j];
            this.locationForms[j]=this.locationForms[i];
            this.locationForms[i]=x;
          }
        }
      }
    }
    console.log(this.locationForms[index].value,this.locationForms[index]);
    this.setData();
  }

  imageEditorDia() {
    let dialogRef = this.dialog.open(ImageEditorDialogComponent,
      {
        panelClass: 'dialog1',
        data: [1 / 1, this.profile_photo],
      });
    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res)
        if (res) {
          this.profile_photo = res
          this.submitImage(res)
          // this.image_change = true
        }
      },
      (err) => console.warn(err)
    );
  }

  submitImage(imageString){
    if(imageString){
      fetch(imageString).then(
        (res)=>res.blob()).then(
          (blob)=>{
            this.formData.append('image', blob, 'a.jpeg');
            this.formData.append('_method', 'put');
            this.sendToBackEnd(this.formData);
          }
        )
    }
    else{this.errorMessage2="Sorry, but something has gone wrong. "}
  }

  sendToBackEnd(data){
    this.tutorService.updateTutorProfile(data).subscribe(
      (res)=>{console.log(res)},
      (err)=>{console.log(err), this.errorMessage2="Sorry, but something has gone wrong with our computers :(  "}
    )
  }

  defState(){
    if(this.stateForm.valid && this.stateForm.dirty){
      this.errorMessage3='';
      this.Profile.intro_statement=this.stateForm.value.state;
      this.tutor.intro_statement=this.stateForm.value.state;
      this.Profile._method='put';
      console.log(this.Profile);
      this.tutorService.updateTutorProfile(this.Profile).subscribe(
        (res) => {console.log(res); },
        (err) => {console.log(err), this.errorMessage3="Sorry, but something has gone wrong with our computers :(  "}
      )
      return this.stStatus=false;
    }else{
      this.errorMessage3='Content is invalid';
      console.log('no');
    }
  }

  mouseEnter(m) {
    this.SideHelperService.sendMessage(m);
  }
}
