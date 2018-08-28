import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.css']
})
export class UserTransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  content: { id: number; date_of_session: string; session_status: string; student: string; quantity: number; hourly_rate: number;description: string; amount: number; };
  trans=[];
  dateStatus = false;

  constructor() { }

  ngOnInit() {
    this.trans = [
      {id: 1, date_of_session:'1st July', session_status:'Comfirmed', student:'Jamie', quantity: 2, hourly_rate: 20.00.toFixed(2), description: 'Math', amount: 40.00.toFixed(2)},
      {id: 2, date_of_session:'3rd July', session_status:'Comfirmed', student:'Leona', quantity: 1, hourly_rate: 20.00.toFixed(2), description: 'English', amount: 20.00.toFixed(2)},
      {id: 3, date_of_session:'13th July', session_status:'Completed', student:'Matt', quantity: 2, hourly_rate: 20.00.toFixed(2), description: 'English', amount: 40.00.toFixed(2)},
      {id: 4, date_of_session:'5th August', session_status:'Completed', student:'Susan', quantity: 2, hourly_rate: 20.00.toFixed(2), description: 'Math', amount: 40.00.toFixed(2)},
      {id: 5, date_of_session:'20th August', session_status:'Cancel', student:'Liam', quantity: 3, hourly_rate: 20.00.toFixed(2), description: 'Physics', amount: 60.00.toFixed(2)},
      {id: 6, date_of_session:'13th September', session_status:'Completed', student:'Adam', quantity: 1, hourly_rate: 20.00.toFixed(2), description: 'Math', amount: 20.00.toFixed(2)},
      {id: 7, date_of_session:'18th September', session_status:'Cancel', student:'Jessica', quantity: 1, hourly_rate: 20.00.toFixed(2), description: 'English', amount: 20.00.toFixed(2)},
      {id: 8, date_of_session:'25th September', session_status:'Comfirmed', student:'Tom', quantity: 3, hourly_rate: 20.00.toFixed(2), description: 'English', amount: 60.00.toFixed(2)},
    ]
  }

  triggered(date1, date2){
    this.dateStatus = false;
    if(date2 <= date1 ){
      console.log('false');
      this.dateStatus = true;
    } else {
      console.log('true');
      console.log("Start Date: " + date1);
      console.log("End Date: " + date2);
    }
  }

}