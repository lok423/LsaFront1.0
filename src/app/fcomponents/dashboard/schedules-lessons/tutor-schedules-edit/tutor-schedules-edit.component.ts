import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ChangeDetectorRef , Inject, PLATFORM_ID } from '@angular/core';
import * as moment from 'moment';
import { TutorService } from '../../../../services/servercalls/tutor.service';
import { CalendarSupportService } from '../../../../services/support/calendar-support.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tutor-schedules-edit',
  templateUrl: './tutor-schedules-edit.component.html',
  styleUrls: ['./tutor-schedules-edit.component.css']
})
export class TutorSchedulesEditComponent implements OnInit {
  tranArray: any;
  events: any = [];
  enventsIndex = 0;
  sessionEvents = [];
  freeEvents = [];
  sucMessage=null;
  indicator=false;//for page loading indicator message 
  originData= new Object;
  chooseWeeks = 1;// set how many weeks we can set
  showSpinner = false;
  // See if client is using browser (SSR)
  isBrowser=false

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Inject(WINDOW) private window: Window, 
    private tutorService: TutorService,
    private calendarService: CalendarSupportService,
    private cdr: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
   }

  ngOnInit() {
    this.tutorService.showTutorSchedules().subscribe(
      (res) => {
        console.log(res);
        let eventObject = this.calendarService.first(res['dataCon'].tutorSchedule);
        this.sessionEvents = eventObject.session;
        this.freeEvents = eventObject.free;
        this.indicator=true;
        this.events = this.sessionEvents.concat(this.freeEvents);
        console.log(this.events);
        if (this.isBrowser){
          this.addCalendar(this.events);
        }
      },
      (error) => console.log(error)
    ); }

  
  // get end time start time should be like 1030
  getEndtime(time: string): any {
    const hour = time.substr(0, 2);
    const minutes = time.substr(2);
    let end;
    if (minutes === '00') {
      end = (Number(time) + 30);
    } else {
      end = (Number(time) + 70);
    }
    // if end is less than 4 digits like: 830, then add 0 to be 0830
    if (end < 1000) {
      end = '0' + end.toString();
    } else {
      end = end.toString();
    }
    return end;
  }
  // set time format time: 1030
  setTimeFormat(day: string, time: string): string {
    const hour = time.substr(0, 2);
    const minutes = time.substr(2);
    const timeFormat = day + 'T' + hour + ':' + minutes + ':00';
    return timeFormat;
  }
  // check if an array exists and not empty
  arrayExists(myArray: any[]) {
    if (typeof myArray !== 'undefined' && myArray.length > 0) {
      return true;
    }
    return false;
  }
  submit() {
    let allEvents = $('#calendar').fullCalendar('clientEvents');
    let dataObj = this.changeData(allEvents, 'fullCalendar');
    let originalData = this.changeData(this.events, 'original');
    console.log(dataObj);
    console.log(originalData);
    // check if every day in the orginal in the dataobj
    for (let originalDate in originalData) {
      if (dataObj.hasOwnProperty(originalDate)) {
        // check if the free time is exactly same
        if (dataObj[originalDate].toString() === originalData[originalDate].toString()) {
          delete dataObj[originalDate];
        } else {
          console.log('This day free time has changed!');
        }
      } else {
        // this means user remove all the free time, then set to '' and add to the data object
        dataObj[originalDate] = '';
        console.log(dataObj);
      }
    }
    // send the data to server
    if (Object.keys(dataObj).length === 0) {
      console.warn('send Data is empty');

    } else {
      console.log(dataObj);
      this.tutorService.updateTutorSchedules(dataObj).subscribe(
        (res) => {this.sucMessage = 'All done!'; console.log(res); },
        (error) => console.log(error),
      );
      console.log('send');
    }
  }
  // check is same year
  isSameYear(year1: string, year2: string) {
    if (year1 === year2) {
      return true;
    }
    return false;
  }
  // check is same week
  isSameWeek(date1: string, date2: string): boolean {
    return moment(date1).isSame(date2, 'week');
  }
  // get the firsday(sunday) of this week
  getSunday(date: string) {
    let day = moment(date).day();
    let sunday = moment(date).subtract(day, 'day').format('YYYY-MM-DD');
    return sunday;
  }
  // let the user to set weeks
  setWeeks(event) {
    this.sucMessage=null;
    let selected = event.srcElement.innerHTML;
    $('#dropdownMenuButton').html(selected);
    //set the chooseWeeks value basing on selected weeks
    let x = selected.substr(5, 2);
    x = Number(x);
    this.chooseWeeks = x;
  }
  // check every event in the calender, if inside the source array, then delete
  deleteEvents(start: any, end: any) {
    if (start.isBefore(moment())) {$('#calendar').fullCalendar('unselect');
      return false; }
    // clientEvents will retrieve all the events in the fullcalendar's memory
    let calendarEvents = $('#calendar').fullCalendar('clientEvents');
    let theEvents = this.calendarService.getAllDaysEvents(start, end, calendarEvents, this.chooseWeeks);
    let source = theEvents.map((e) => {
      return e.start;
    });
    console.log(source);
    let allEvents = $('#calendar').fullCalendar('clientEvents', function(e){
      return (source.includes(e.start._i));
    }); // return the put all calendar events that late than present and belong to "free time"
    console.log('all', allEvents);
    let index;
    for (let i = 0; i < allEvents.length; i++) {
      let oldEvent = allEvents[i];
      index = i;
      // the event start time string
      let aa = oldEvent.start as moment.Moment;
      let eventStart = aa.format();
      if (source.includes(eventStart)) {
        if (oldEvent.title === '') {
          $('#calendar').fullCalendar('removeEvents', oldEvent._id);
        }
      }
    }
  }
  // trigger removeCalendar
  removeEvent() {
    this.sucMessage=null;
    let allEvents = $('#calendar').fullCalendar('clientEvents');
    $('#calendar').fullCalendar('destroy');
    this.removeCalendar(allEvents);
  }
  // trigger addCalendar
  addEvent() {
    this.sucMessage=null;
    let allEvents = $('#calendar').fullCalendar('clientEvents');
    $('#calendar').fullCalendar('destroy');
    this.addCalendar(allEvents);
  }
  // set add events
  addCalendar(myevents) {
    $('#calendar').fullCalendar({
      header: {
        left: 'today',
        center: 'prev title next',
        right: ''
      },
      views: {
        agendaWeek: {
          horizontalSelect: true
        }
      },
      themeSystem: 'bootstrap3',
      height: 'parent',
      defaultView: 'agendaWeek',
      events: myevents,
      eventLongPressDelay:1,
      displayEventTime: false,
      selectHelper: true,
      longPressDelay:1,
      selectable: true,
      unselectAuto: false,
      allDaySlot: false,
      minTime: moment.duration('08:00:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function(view,element){//set the button in header
        $('.fc-today-button').css({'position':'absolute','top':'11px','font-size':'15px','background-color':'#0099FF','color':'white','font-weight':'bold'});
        $('.fc-prev-button').css({'position':'absolute','left':'8%','height':'30px','width':'30px','border-radius':'100%','font-size':'15px','color':'#0099FF','font-weight':'bold','border':'2px solid #0099FF','background-color':'white'});//
        $('.fc-prev-button').text('<');
        $('.fc-center h2').css({'font-size':'25px','color':'#525252','font-weight':'bold'});
        $('.fc-next-button').css({'position':'absolute','right':'8%','height':'30px','width':'30px','border-radius':'100%','font-size':'15px','color':'#0099FF','font-weight':'bold','border':'2px solid #0099FF','background-color':'white'});
        $('.fc-next-button').text('>');
      },
      eventAfterRender: function(event, element, view) {// style the events
        $(element).css({'pointer-events':'none','font-size':'13px','border-radius':'0px','border':'0.1px solid white','margin':'0px'});
        $(element).css({'font-size':'13px','border-radius':'0px','border':'0.1px solid white','margin':'0px'});
      },
      eventRender: function(event, element, view) {   //render how event look like
        $('span').css({'font-size':'13px','color':'#525252'});//global grid text size
        $('span.fc-day-number').css({'font-size':'12px','color':'#525252'});//calendar date number
      },
      eventClick: (e, jsEvent, view) => {// if has students then cannot be removed
        this.sucMessage=null;
        let start = e.start;
        let end = e.end;
        this.deleteEvents(start, end);
      },
      select: (start, end, jsEvent, view) => {
        if (start.isBefore(moment())) {$('#calendar').fullCalendar('unselect');
          return false; }
        let calendarEvents = $('#calendar').fullCalendar('clientEvents');
        let source = this.calendarService.getMultipleDaysEvents(start, end, calendarEvents, this.chooseWeeks);
        $('#calendar').fullCalendar('addEventSource', source);
        // all the events will be inside the fullcalender events property, so the initial this.events will not change
        $('#calendar').fullCalendar('unselect');
      }
    });
  }
  // used to remove events
  removeCalendar(myevents) {
    $('#calendar').fullCalendar({
      header: {
        left: 'today',
        center: 'prev title next',
        right: ''
      },
      themeSystem: 'bootstrap3',
      views: {
        agendaWeek: {
          horizontalSelect: true
        }
      },
      height: 'parent',
      defaultView: 'agendaWeek',
      events: myevents,
      selectable: true,
      longPressDelay: 1,
      displayEventTime: false,
      unselectAuto: false,
      allDaySlot: false,
      selectOverlap: true,
      minTime: moment.duration('08:0:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function(view,element){// set the button in header
        $('.fc-today-button').css({'position':'absolute','top':'11px','font-size':'15px','background-color':'#0099FF','color':'white','font-weight':'bold'});
        $('.fc-prev-button').css({'position':'absolute','left':'8%','height':'30px','width':'30px','border-radius':'100%','font-size':'15px','color':'#0099FF','font-weight':'bold','border':'2px solid #0099FF','background-color':'white'});//
        $('.fc-prev-button').text('<');
        $('.fc-center h2').css({'font-size':'25px','color':'#525252','font-weight':'bold'});
        $('.fc-next-button').css({'position':'absolute','right':'8%','height':'30px','width':'30px','border-radius':'100%','font-size':'15px','color':'#0099FF','font-weight':'bold','border':'2px solid #0099FF','background-color':'white'});
        $('.fc-next-button').text('>');
      },
      eventAfterRender: function(event, element, view) {// style the events
        $(element).css({'pointer-events':'none','font-size':'13px','border-radius':'0px','border':'0.1px solid white','margin':'0px'});
        if ($(this.window).width() < 1025) {
          $(element).css({'font-size':'13px','border-radius':'0px','border':'0.1px solid white','margin':'0px'});
        }else {
          $(element).css({'pointer-events':'none','font-size':'13px','border-radius':'0px','border':'0.1px solid white','margin':'0px'});
        }
      },
      eventRender: function(event, element, view) { // render how event look like
        $('span').css({'font-size':'13px','color':'#525252'});//global grid text size
        $('span.fc-day-number').css({'font-size':'12px','color':'#525252'});//calendar date number
      },
      eventClick: (e, jsEvent, view) => {// if has students then cannot be removed
        this.sucMessage=null;
        let start = e.start;
        let end = e.end;
        this.deleteEvents(start, end);
      },
      select: (start, end, jsEvent, view) => {
        this.sucMessage = null;
        this.showSpinner = true;
        setTimeout(() => {
          this.deleteEvents(start, end);
          this.showSpinner = false;
        }, 0);
      },
    });
  }
  // change data format
  changeData(allEvents: any, condition: string): any {
    let dataObj = {};
    for (let event of allEvents) {
      // get the date, starttime, name, id, status of every event
      let date;
      let startTime;
      let studentName;
      if (condition === 'fullCalendar') {
        let dateFormat = (event.start as moment.Moment).format();
        date = dateFormat.substr(0, 10);
        startTime = dateFormat.substr(11, 2) + dateFormat.substr(14, 2);
        studentName = event.title.split(' ')[0];
      }
      if (condition === 'original') {
        date = event.start.substr(0, 10);
        startTime = event.start.substr(11, 2) + event.start.substr(14, 2);
        studentName = event.title;
      }
      if (dataObj.hasOwnProperty(date)) {
        dataObj[date].push(startTime);
      } else {
        dataObj[date] = [startTime];
      }
    }
    return dataObj;
  }
  spinner() {
    this.showSpinner = true;
  }
}
