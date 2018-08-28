import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../../services/security/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../models/UserModel';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  fillAll: string;
  user = {
    email: '',
    first_name: '',
  };
  constructor(
    private dialogRef: MatDialogRef<PasswordResetComponent>, 
    private authService:AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  onSubmit({valid}:{valid: boolean})  {
    console.log(valid)

    if(!valid ) {
      console.log("Dosn't Work");
      this.fillAll = 'All fields must be filled.';
    }
    else{
      console.log('works')
      let nww={}
      nww['email']=this.user['email']
      this.authService.forgotPassword(nww).subscribe(
        (res)=>console.log(res),
        (error)=>console.log(error)
      )

      }
  }

}
