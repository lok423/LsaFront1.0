import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/servercalls/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SideHelperService } from '../../../services/helpers/side-helper.service';

@Component({
  selector: 'app-user-edit-details',
  templateUrl: './user-edit-details.component.html',
  styleUrls: ['./user-edit-details.component.css']
})
export class UserEditDetailsComponent implements OnInit {
  userInfo: any;
  userDetailsForm: FormGroup;

  abcd:{};

  DOBStatus = false;
  locationStatus = false;
  pNumberStatus = false;
  lNameStatus = false;
  fNameStatus = false;
  genderStatus = false;
  pNameStatus = false;
  pPhoneStatus = false;
  pRelationStatus = false;
  feedbackMessage:string;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private SideHelperService: SideHelperService,

  ) {
    this.userService.showUserInfo().subscribe(
      (res)=>{this.userInfo = Object.assign(res['dataCon'].userBasic, res['dataCon'].userSecondary), 
              console.log(this.userInfo), 
              this.createForm(this.userInfo)},
      (error)=>{this.feedbackMessage="Sorry, we can't get to your information at this time."}
    )
   }

   createForm(a){
     this.userInfo=a
    this.userDetailsForm = this.formBuilder.group({
      first_name: [this.userInfo.first_name, [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z\s]*$')]],
      last_name:  [this.userInfo.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z\s]*$')]],
      phone_num_pri: [this.userInfo.phone_num_pri, [Validators.required, Validators.minLength(7), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      DOB: [this.userInfo.DOB, [Validators.required, this.minDate ]],
      location: [this.userInfo.location, Validators.required],
      gender: [this.userInfo.gender, Validators.required],
      // other_contact_name: [this.userInfo.other_contact_name, [Validators.minLength(2), Validators.maxLength(15), Validators.pattern('^[a-zA-Z\s]*$')]],
      // other_contact_phone_num: [this.userInfo.other_contact_phone_num, [Validators.minLength(7), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      // other_contact_relation: [this.userInfo.other_contact_relation,  [Validators.minLength(2), Validators.maxLength(15), Validators.pattern('^[a-zA-Z\s]*$')]]
    },{})
  }

  ngOnInit() {
  }

  minDate(AC: FormControl){
    let dobValue=AC.value;
    if(dobValue){
      let dateArr = dobValue.split('/');
      let year = parseInt(dateArr[0], 10);
      let minDOB = 1950;
      if(year <= minDOB){
        return {dob:{}}
      } else{
        return null;
      }
    }
  }


  changeText(event) {
    const text = event.target.innerText;
    if (text === "EDIT") {
      event.target.innerText = 'CANCEL';
    } else {
      event.target.innerText = 'EDIT';
    }
  }


  // on sumbit button
  onSubmit() {

  if(this.userDetailsForm.valid && this.userDetailsForm.dirty){
    console.log('conditions met')
      this.userService.updateUserInfo(this.userDetailsForm.value).subscribe(
        (res)=>{this.feedbackMessage='Your changes have been saved'},
        (error)=>{this.feedbackMessage='Sorry, but something has gone wrong.', console.log(error)}
      )
    }
  }

  mouseEnter(m) {
    this.SideHelperService.sendMessage(m);
  }
}