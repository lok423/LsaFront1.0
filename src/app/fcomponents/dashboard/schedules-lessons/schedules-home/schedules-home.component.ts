import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedules-home',
  templateUrl: './schedules-home.component.html',
  styleUrls: ['./schedules-home.component.css']
})
export class SchedulesHomeComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
  }
   // when user clicks list button
   showList() {
    console.log('Now show list of sessions');
    this.router.navigate(['./app/dashboard/tutor/schedules/list']);
  }
  showCalendar() {
    console.log('Now show calendar of sessions');
    this.router.navigate(['./app/dashboard/tutor/schedules/calendar']);
  }
}
