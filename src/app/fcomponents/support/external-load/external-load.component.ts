import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../../basic/login/login.component';

@Component({
  selector: 'app-external-load',
  templateUrl: './external-load.component.html',
  styleUrls: ['./external-load.component.css']
})
export class ExternalLoadComponent implements OnInit {
  event:string;
  dialogRef: MatDialogRef<LoginComponent>;  

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
   }

  ngOnInit() {
    let urlEvent = this.route.snapshot.params['event'];
    if(urlEvent == 'resetsuccess'){
      this.event= 'You have successfully reseted your password.'
    }
    if(urlEvent == ' '){
    }
  }

  loginUser($event){
    let dialogRef = this.dialog.open(LoginComponent,
      {panelClass: 'dialog1'});
  }
}