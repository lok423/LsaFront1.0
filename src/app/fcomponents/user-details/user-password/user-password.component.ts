import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { UserService } from '../../../services/servercalls/user.service';
import { SideHelperService } from '../../../services/helpers/side-helper.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})

export class UserPasswordComponent implements OnInit {
  errorMessage: string;
  validationMessages: { oldPassword: { required: string; minlength: string; maxlength: string; }; };
  userPasswordResetForm: FormGroup;

  constructor(
    private userService:UserService,
    private formBuilder:FormBuilder,
    private elem: ElementRef,   
    private SideHelperService: SideHelperService,
  ) {
    }

  ngOnInit(){
    this.userPasswordResetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      newPassword_confirmation: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    },{
      validator: this.confirmPassValidator
      }
    );
  }

  confirmPassValidator(con: AbstractControl){
    let newpass = con.value.newPassword
    let confirmpass = con.value.newPassword_confirmation
    if(newpass != confirmpass){return {cpv:{}}}
    else{return null}
  }

  submitForm(){
    if (this.userPasswordResetForm.dirty && this.userPasswordResetForm.valid) {

      this.userService.updateUserPassword(this.userPasswordResetForm.value).subscribe(
        (res)=>{console.log(res)},
        (err)=>{console.log(err)}
      )
    }
    else{
      this.errorMessage= 'Please fill all forms.'
    }
}

  mouseEnter(m) {
    this.SideHelperService.sendMessage(m);
  }
}