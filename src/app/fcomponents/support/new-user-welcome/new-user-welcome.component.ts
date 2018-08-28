import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-user-welcome',
  templateUrl: './new-user-welcome.component.html',
  styleUrls: ['./new-user-welcome.component.css']
})
export class NewUserWelcomeComponent implements OnInit {

  constructor(
    private titleService: Title,
  ) {
    this.titleService.setTitle('Learnspace | Welcome');
  }

  ngOnInit() {
  }
    selected1 = '';
    YearLevel = true;
    CoursePage = false;
    highCourse= true;
    uniCourse= false;
    showCourse(){
      this.YearLevel = false;
      this.CoursePage = true;
    }
    showHighCourse(){
      this.highCourse = true;
      this.uniCourse= false;
    }
    showUniCourse(){
      this.uniCourse = true;
      this.highCourse = false;
    }

}
