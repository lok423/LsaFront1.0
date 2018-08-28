import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../../services/security/auth.service';
import { UserModel } from '../../../models/UserModel';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewUserComponent } from '../../../fcomponents/basic/newuser/newuser.component';
import { PasswordResetComponent } from '../password-reset/password-reset.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  destination: string;
  user = {
    email: '',
    password:''
  }
  fillAll:string

  constructor(@Inject(WINDOW) private window: Window, 
    private authService:AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<NewUserComponent,PasswordResetComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // this.destination = this.router.url
    // console.log(this.destination)
  }
  ngOnDestory(){

  }

  newUser(){
    this.dialogRef.close();
    let dialogRef = this.dialog.open(NewUserComponent,
      {panelClass:'dialog1'});
  }

  setPwd(){
    this.dialogRef.close();
    let dialogRef = this.dialog.open(PasswordResetComponent,
      {panelClass:'dialog1'});
  }

  onSubmit({valid}:{valid: boolean})  {
    console.log(valid)
    if(!valid) {
      console.log("Dosn't Work");
      this.fillAll = 'All fields must be filled.';
    }
    else{
      console.log('works')
      this.authService.login(this.user).then((user) => {
        this.dialogRef.close();
        this.window.location.reload();
        //this.router.navigate([this.destination]);
      })

      .catch((err) => {
        console.log(err);
        if (err.error.code == 422){
          this.fillAll = 'Email or password is incorrect.'
        }
        else{
          this.fillAll = 'Sorry, but something went wrong.';
        }
      });
    }
  }
}
