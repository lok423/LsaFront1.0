import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, Inject, Input, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { query } from '@angular/animations';
import { CalendarSupportService } from '../../../../services/support/calendar-support.service';
import { LearnerService } from '../../../../services/servercalls/learner.service';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-session-edit-dialog',
  templateUrl: './session-edit-dialog.component.html',
  styleUrls: ['./session-edit-dialog.component.css']
})
export class SessionEditDialogComponent implements OnInit {

  events: any = [];
  eventContainer = {
    session: [],
    free: [],
  };
  selectedTime = [];
  locations = []; // location view
  sessionData: any;
  schedules: any;
  userRole: number;
  withinTwelveHours: boolean;
    // See if client is using browser (SSR)
    isBrowser=false
    
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Inject(WINDOW) private window: Window, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SessionEditDialogComponent>,
    private calendarService: CalendarSupportService,
    private learnerService: LearnerService,
    private route: ActivatedRoute,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
   }

  ngOnInit() {
    this.sessionData = this.data[0];
    this.withinTwelveHours = this.data[0].withinTwelveHours;
    this.events = this.data[1];
    this.locations = this.data[2];
    this.userRole = this.data[3];
    // console.log(this.userRole, this.withinTwelveHours);
    for (let i = 0; i < this.events.length; i++) { // delete the free time that before current time
      let eve = this.events[i];
      if (moment(eve.end).isBefore(moment())) {
        delete this.events[i];
        this.events.splice(i, 1);
        i = i - 1;
      }
    }
    if(this.isBrowser){
      this.addCalendar(this.events);
    }
  }
  cancel() {
    // if time changed then remove the selected time
    if (this.timeChanged) {
      this.changeTimescolor(this.data[1], this.selectedTime);
    }
    // once user clicks cancel, remove the session time from free events, they were added when user clicks eidt button
    let times = this.data[0].session_times;
    this.removeTimes(this.events, times);
    this.dialogRef.close('1');
  }
  // remove session time from free events
  removeTimes(events: any, times: any) {
    for (let time of times) {
      for (let event of events) {
        if (event.start === time) {
          this.calendarService.deleteFromArray(events, event);
          break;
        }
      }
    }
  }
  changeTimescolor(data: any, selectedTime: any) {
    for (let time of selectedTime) {
      for (let event of data) {
        if (event.start === time) {
          event.color = '#00ad2b';
          break;
        }
      }
    }
  }
  save() {
    let sessionID = this.sessionData.session_id;
    let newSession = this.getNewsession(sessionID);
    console.log(newSession[sessionID]);
    // if the newsession object is not empty then transfer to dashboard
    if (Object.keys(newSession).length !== 0) {
      // update the data[1], every time click edit, only data[1] remaining changed from the last click
      this.deleteTimes(this.selectedTime, this.data[1]);
      this.dialogRef.close(newSession);
    } else {
      console.log('nothing');
      this.dialogRef.close('2');
    }
  }
  // get new session when user clicks save, no matter user change something or not
  getNewsession(sessionID: any) {
    let newSession = {};
    let myObj = {};
    let changedFree = $('#myCheckbox').prop('checked');
    if (this.locationChanged()) {
      myObj['s_location'] = $('#myLocation').val();
    }
    if (this.timeChanged()) {
      let times = this.getTimes(this.selectedTime);
      // console.log(times);
      let start = this.findValue(this.selectedTime).min;
      let end = this.findValue(this.selectedTime).max;
      let duration = moment.duration(moment(end).diff(moment(start))).asHours() + 0.5;
      // update new session
      myObj['s_date'] = start;
      myObj['s_times'] = times;
      myObj['s_duration'] = duration;
    }
    // add session id to the object
    if (this.timeChanged() || this.locationChanged()) {
      // if user tick the checkbox
      newSession[sessionID] = myObj;
    }
    return newSession;
  }
  // delete selected times from data [1]
  deleteTimes(selectedTime: any, events: any) {
    for (let time of this.selectedTime) {
      for (let event of events) {
        if (event.start === time) {
          let index = events.indexOf(event);
          events.splice(index, 1);
          break;
        }
      }
    }
  }
  // delete the events if the color is changed
  deleteEvents(events: any) {
    for (let event of events) {
      if (event.color === '#00ddff') {
        this.calendarService.deleteFromArray(events, event);
      }
    }
  }
  // get all the time using max and min
  getTimes(selectedTime: any) {
    return selectedTime.map((e) => {
      let time = e.substr(11, 2) + e.substr(14, 2);
      return time;
    });
  }
  // check if location changed
  locationChanged() {
    let currentLocation = $('#myLocation').val();
    let previousLocation = this.sessionData.session_location;
    if (currentLocation === previousLocation) {
      return false;
    }
    return true;
  }
  // check if time changed or not
  timeChanged() {
    if (this.selectedTime.length === 0) {
      return false;
    }
    return true;
  }
  // set add events
  addCalendar(myevents) {
    let today = moment().day();
    $('#calendar').fullCalendar({
      header: {
        left: '',
        center: 'prev title next',
        right: 'today'
      },
      views: {
        agendaThreeDay: {
          type: 'agenda',
          duration: {
            days: 3
          },
          buttonText: 'Week'
        }
      },
      themeSystem: 'bootstrap3',
      height: 'parent',
      // defaultView: 'agendaWeek',
      defaultView: $(this.window).width() < 576 ? 'agendaThreeDay' : 'agendaWeek',
      firstDay: today,
      events: myevents,
      selectable: false,
      eventOverlap: false,
      // tslint:disable-next-line:no-unused-expression
      displayEventTime: false,
      unselectAuto: false,
      allDaySlot: false,
      selectOverlap: false,
      minTime: moment.duration('08:00:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function (view, element) {//set the button in header
        $('.fc-prev-button').text('<');
        $('.fc-next-button').text('>');
        $('.fc-agendaThreeDay-view').css({'border':'0.5px solid rgb(201, 201, 201) !important', 'border-bottom': '1px solid rgb(201, 201, 201) !important', 'margin-top': '-20px'});
        $('.fc-agendaWeek-view').css({'border':'0.5px solid rgb(201, 201, 201) !important', 'border-bottom': '1px solid rgb(201, 201, 201) !important', 'margin-top': '-10px'});

        if ($(this.window).width() < 576){
          $('.fc-time-grid-container').css({'height': '15rem'});
          $('.fc-center h2').css({'font-size': '16px', 'font-family': 'Comic Sans MS', 'color': '#525252', 'font-weight': 'bold', 'margin-top': '-30px'});
          $('.fc-today-button').css({'position': 'absolute', 'top': '1%', 'right': '2%', 'font-size': '12px', 'background-color': '#0099FF', 'color': 'white', 'font-weight': 'bold'});
          $('.fc-prev-button').css({'position': 'absolute', 'left': '0%', 'top': '40%', 'height': '20px', 'width': '20px', 'border-radius': '100%', 'font-size': '5px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '1px solid #0099FF', 'background-color': 'white'}); 
          $('.fc-next-button').css({'position': 'absolute', 'right': '0%', 'top': '40%', 'height': '20px', 'width': '20px', 'border-radius': '100%', 'font-size': '5px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '1px solid #0099FF', 'background-color': 'white'});
          $('.fc-time-grid .fc-slats td span').css({'font-size':'5px', 'margin-left': '-5px'});
        } else {
          $('.fc-center h2').css({'font-size': '20px', 'font-family': 'Comic Sans MS', 'color': '#525252', 'font-weight': 'bold', 'margin-top': '-25px'});
          $('.fc-today-button').css({'position': 'absolute', 'top': '9%', 'right': '6%', 'font-size': '15px', 'background-color': '#0099FF', 'color': 'white', 'font-weight': 'bold'});
          $('.fc-prev-button').css({'position': 'absolute', 'left': '-2%', 'top': '50%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white'}); //
          $('.fc-next-button').css({'position': 'absolute', 'right': '-2%', 'top': '50%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white'});
        }
      },
      eventAfterRender: function (event, element, view) {// style the events
        $(element).css({ 'font-size': '13px', 'border-radius': '0px', 'border': '0.1px solid white', 'margin': '0px' });
      },
      eventClick: (e, jsEvent, view) => {
        this.validate(e);
        this.updateCalendar();
        // console.log(this.selectedTime);
      },
    });
  }
  // validate the user click
  validate(e: any) {
    let start = e.start;
    let current = (start as moment.Moment).format();
    // console.log(current);
    let next = (e.start as moment.Moment).add(30, 'minutes').format();
    // already add 30 minutes, so subtract 60 minutes will be previous
    let previous = (e.start as moment.Moment).subtract(60, 'minutes').format();
    if (e.color === '#00ad2b') {
      if (this.selectedTime.length === 0 && this.exist(this.events, next)) {
        this.changeColor(this.events, current, '#00ddff');
        this.changeColor(this.events, next, '#00ddff');
        // console.log(this.events);
        this.selectedTime.push(current);
        this.selectedTime.push(next);
      }
      if (this.selectedTime.length === 0 && !this.exist(this.events, next) && this.exist(this.events, previous)) {
        this.changeColor(this.events, current, '#00ddff');
        this.changeColor(this.events, previous, '#00ddff');
        this.selectedTime.push(current);
        this.selectedTime.push(previous);
      }
      if (this.selectedTime.length > 0) {
        let min = this.findValue(this.selectedTime).min;
        let max = this.findValue(this.selectedTime).max;
        if (previous === max || next === min) {
          this.changeColor(this.events, current, '#00ddff');
          this.selectedTime.push(current);
        }
      }
    } else {
      // if already choosed
      let min = this.findValue(this.selectedTime).min;
      let max = this.findValue(this.selectedTime).max;
      // console.log(min, max, current);
      // only start and end can be removed
      if (this.selectedTime.length === 2) {
        if (current === min) {
          this.changeColor(this.events, current, '#00ad2b');
          this.changeColor(this.events, next, '#00ad2b');
          this.calendarService.deleteFromArray(this.selectedTime, current);
          this.calendarService.deleteFromArray(this.selectedTime, next);
        }
        if (current === max) {
          this.changeColor(this.events, current, '#00ad2b');
          this.changeColor(this.events, previous, '#00ad2b');
          this.calendarService.deleteFromArray(this.selectedTime, current);
          this.calendarService.deleteFromArray(this.selectedTime, previous);
        }
      } else {
        // if more than two time slots
        if (current === min || current === max) {
          this.changeColor(this.events, current, '#00ad2b');
          this.calendarService.deleteFromArray(this.selectedTime, current);
        }
      }
    }
  }
  // update calendar
  updateCalendar() {
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', this.events);
  }
  // map the array time moment objects and find min and max
  findValue(array: any) {
    let x = array.map((e) => {
      return moment(e);
    });
    let min = moment.min(x);
    let max = moment.max(x);
    return {
      min: min.format().substr(0, 19),
      max: max.format().substr(0, 19)
    };
  }
  // change the color for an event
  changeColor(events: any, startdate: any, myColor: any) {
    for (let arrayEvent of events) {
      let arrayStart = arrayEvent.start;
      if (arrayStart === startdate) {
        arrayEvent.color = myColor;
        break;
      }
    }
  }
  // event extist
  exist(events: any, selected: string): boolean {
    for (let event of this.events) {
      let x = event.start;
      if (x === selected) {
        return true;
      }
    }
    return false;
  }

}
