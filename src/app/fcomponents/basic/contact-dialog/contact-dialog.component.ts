import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeneralService } from '../../../services/servercalls/general.service';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {
  contactUs ={
    name:'',
    email:'',
    phone:'',
    message:'',
    tutor_name:''
  }
  fillAll:string
  contactForm=<boolean>true

  constructor(  
    private contactUsService:GeneralService,
    private dialogRef: MatDialogRef<ContactDialogComponent>,     
    @Inject(MAT_DIALOG_DATA)
    public data:string,
  ) { }

  ngOnInit() {
    this.contactUs.tutor_name = this.data
    return this.data;
  }

  onSubmit({valid}:{valid: boolean})  {
    console.log(valid)
    if(!valid) {
      console.log("Dosn't Work");
      this.fillAll = 'All fields must be filled.';
    }
    else {
      console.log('works');
      this.contactUsService.storeContact(this.contactUs).subscribe(
        (contact)=>{
          console.log('made it');
          console.log(contact);
          this.contactForm=false
        },
        (error)=>{
          console.log('Noooooo');
          console.log(error)
          this.fillAll = 'Sorry, but something has gone wrong.'
        }
      );
    }
  }
}