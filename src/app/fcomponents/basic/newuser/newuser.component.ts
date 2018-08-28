import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/security/auth.service';
import { UserModel } from '../../../models/UserModel';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewUserComponent implements OnInit {
  newUser = {
    first_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };
  noMatch: boolean = true;
  fillAll:string;
  p:string;
  c:string;
  words='';
  constructor(
    private dialogRef: MatDialogRef<NewUserComponent>,
    private authService:AuthService,
    private elem: ElementRef,
    private router: Router,

  ) { }

  checkPWD(){
    let p =  document.getElementsByName("password")[0]['value'];;
    let p2 =  document.getElementsByName("passwordConfirm")[0]['value'];;
    if(p2 === p){
      console.log('yes')
      this.noMatch=false
    } else {
      this.noMatch=true
    }
  }

  ngOnInit() {
  }

  onSubmit({valid}:{valid: boolean})  {
    console.log(valid)
    console.log(this.noMatch)

    if(!valid) {
      console.log("Dosn't Work");
      this.fillAll = 'All fields must be filled.';
    }
    else if(this.noMatch){
      this.fillAll = 'Passwords do not match.';
    }

    else{
      console.log('works')
      this.authService.register(this.newUser)
      .then((res) => {
        console.log(res);
        this.dialogRef.close();
        this.router.navigate(['/app/onboard/'+this.newUser['first_name']]);
      })
      .catch((err) => {
        console.log(err);
        if(err.error.code  == 422 ){
          this.fillAll = 'This email address is already registered. '
        }else{
          this.fillAll = 'Sorry but something went wrong '
        }
      });
    }
  }
}
