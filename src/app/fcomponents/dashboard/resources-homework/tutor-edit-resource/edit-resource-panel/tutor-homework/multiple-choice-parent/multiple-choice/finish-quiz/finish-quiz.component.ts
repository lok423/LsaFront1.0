import { Component, OnInit ,Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-finish-quiz',
  templateUrl: './finish-quiz.component.html',
  styleUrls: ['./finish-quiz.component.css']
})
export class FinishQuizComponent implements OnInit {


    constructor(@Inject(MAT_DIALOG_DATA) public data){

    }


  ngOnInit() {
  }

}
