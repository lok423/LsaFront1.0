import { Inject, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TutorService } from '../../../../services/servercalls/tutor.service';
import { CalendarSupportService } from '../../../../services/support/calendar-support.service';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tutor-schedules-show',
  templateUrl: './tutor-schedules-show.component.html',
  styleUrls: ['./tutor-schedules-show.component.css']
})
export class TutorScheduleShowComponent implements OnInit {
  // this is the events with students, but 30 minutes seperated
  sessionEvents: any = [];
  // this is the events with free time
  freeEvents: any = [];
  // this is the events which merged all the session events, from session start to end time
  mergedEvents: any = [];
  // See if client is using browser (SSR)
  isBrowser=false
  
  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    @Inject(WINDOW)
    private window: Window,
    private router: Router,
    private tutorService: TutorService,
    private calendarService: CalendarSupportService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
  }

  ngOnInit() {
    // console.log($(this.window).width());
    this.tutorService.showTutorSchedules().subscribe(
      (res) => {
        let events = this.calendarService.first(res['dataCon'].tutorSchedule);
        this.sessionEvents = events['session'];
        this.freeEvents = events['free'];
        console.log(this.sessionEvents);
        // set the merged events
        for (let element of this.sessionEvents) {
          if (!this.inSide(this.mergedEvents, element)) {
            let start = element.start;
            let startTime = this.findStartTime(this.sessionEvents, start);
            let endTime = this.findEndTime(this.sessionEvents, start);
            endTime = moment(endTime).add(30, 'minutes').format().substr(0, 19);
            let myObj = {
              id: element.id,
              title: element.title,
              start: startTime,
              end: endTime,
              color: element.color
            };
            this.mergedEvents.push(myObj);
            console.log(this.mergedEvents);
          }
        }
        this.mergedEvents = this.mergedEvents.filter((value, index, array) =>
          !array.filter((v, i) => JSON.stringify(value) === JSON.stringify(v) && i < index).length);
        console.log(this.mergedEvents);
        // For SSR purposes
        if(this.isBrowser){
          this.showCalendar();
        }
      },
      (error) => console.log(error)
    );
  }
  showCalendar() {
    // let jsonData = dd;
    let fcSources = {
      events1: this.mergedEvents,
      events2: this.freeEvents
    };
    let lastView = 'x';
    console.log(this.mergedEvents);
    $('#calendar').fullCalendar({
      header: {
        left: 'today',
        center: 'prev title next',
        right: 'month,' + ($(this.window).width() < 576 ? 'agendaThreeDay' : 'agendaWeek'),
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
      defaultView: $(this.window).width() < 576 ? 'agendaThreeDay' : 'month',
      // defaultView: 'agendaThreeDay',
      aspectRatio: 1.09,
      navLinks: true,
      eventSources: [fcSources.events1, fcSources.events2],
      eventColor: '#0099FF',
      displayEventTime: false,
      allDaySlot: false,
      height: 'parent',
      minTime: moment.duration('08:00:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function (view) {
        if (lastView != view.name) {
          if (view.name != 'agendaWeek') {
            $('#calendar').fullCalendar('removeEventSource', fcSources.events2);
          };
          // tslint:disable-next-line:max-line-length
          if ((view.name == 'agendaWeek') && (lastView === 'listMonth' || lastView === 'month')) {
            $('#calendar').fullCalendar('addEventSource', fcSources.events2);
          };
        }
        lastView = view.name;
      },
      eventAfterRender: function (event, element, view) {
        // tslint:disable-next-line:max-line-length
        $(element).css({
          'font-size': '13px',
          'border-radius': '0px',
          'border': '0.1px solid white',
          'margin': '0px'
        }); // 'margin-top':'0.5px'
      },
      eventRender: (event, element, view) => {
        console.log(view.name);
        if ((event.title) !== '') {
          let x = event.start as moment.Moment;
          let y = event.end as moment.Moment;
          let date = x.format('MMM DD, YYYY');
          let startTime = x.format().substr(11, 5);
          let endTime = y.format().substr(11, 5);
          // tslint:disable-next-line:max-line-length
          let content = '<div style="font-size: 0.8rem;">' + '<p><strong>Date: </strong>' + date + '</p>' + '<p><strong>Time: </strong>' + startTime + ' - ' + endTime + '</p>' + '</div>';
          (element as any).popover({
            title: event.title,
            selector: '.popover',
            container: '#calendar', // the popover now is one part of the element, append the popover on the element
            html: true, // allow the content to be html
            // tslint:disable-next-line:max-line-length
            content: content,
            trigger: 'manual',
            placement: 'left'
          }).on('mouseenter', function () {
            let _this1 = this;
            ($(this) as any).popover('show');
            $('.popover').on('mouseleave', function () {
              ($(_this1) as any).popover('hide');
            });
          }).on('mouseleave', function () {
            let _this2 = this;
            setTimeout(function () {
              if (!$('.popover:hover').length) {
                ($(_this2) as any).popover('hide');
              }
            }, 1);
          });
        }
        $('.fc-body .fc-row').css({'min-height': '25px' }); // calendar minimum height
        $('span').css({ 'font-size': '13px', 'color': '#525252' }); //global grid text size
        $('span.fc-day-number').css({ 'font-size': '12px', 'color': '#525252' }); //calendar date number

        //set the button in header
        if ( $(this.window).width() < 576){
          $('.fc-center h2').css({ 'font-size': '18px', 'padding-left': '0', 'color': '#525252', 'font-weight': 'bold' });
          $('.fc-agendaThreeDay-button').css({'margin-top': '-2.55rem', 'background-color': 'darkgrey', 'color':'white', 'font-weight':'bold', 'font-size':'15px' });
        } else {
          $('.fc-center h2').css({'font-size': '25px', 'color': '#525252', 'font-weight': 'bold'});
        }
          $('.fc-today-button').css({'position': 'relative', 'bottom': '41px', 'font-size': '15px', 'background-color': '#0099FF', 'color': 'white', 'font-weight': 'bold' });
          $('.fc-prev-button').css({'position': 'absolute', 'top': '17%', 'left': '5%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white' }); //
          $('.fc-prev-button').text('<');
          $('.fc-next-button').css({'position': 'absolute', 'top': '17%', 'right': '5%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white'});
          $('.fc-next-button').text('>');
          $('.fc-state-default').css({'text-shadow': 'none', 'box-shadow': 'none' }); //
          $('.fc-month-button').css({'position': 'relative','bottom': '41px','font-size': '15px','color': 'white', 'font-weight': 'bold', 'background-color': '#0099FF'});
          $('.fc-month-button').click(function () { $('.fc-month-button').css({'background-color': '#0077c6'}); });
          $('.fc-agendaWeek-button').css({'position': 'relative','bottom': '41px','font-size': '15px','color': 'white','font-weight': 'bold','background-color': '#0099FF'});
          $('.fc-agendaWeek-button').click(function () { $('.fc-agendaWeek-button').css({'background-color': '#0077c6'});});
          $('.fc-listMonth-button').css({'position': 'relative', 'bottom': '41px','font-size': '15px','color': 'white','font-weight': 'bold', 'background-color': '#0099FF'});
          $('.fc-listMonth-button').click(function () { $('.fc-listMonth-button').css({'background-color': '#0077c6'});});
      },
      eventClick: (calEvent, jsEvent, view) => {
        // here we must use arrow function because this will not be created for the event, so we can refer to this function
        let studentName: string = calEvent.title;
        if (studentName !== '') {
          // this.router.navigate(['./app/dashboard/tutor/sessions']);
        }
      },
    });
  }
  findObject(array: any, time: any) {
    for (let element of array) {
      if (element.start === time) {
        return element;
      }
    }
  }
  // findStart object
  findStartTime(array: any, time: any) {
    let startTime = time;
    let currentObj = this.findObject(array, time);
    let currentID = currentObj.id;
    for (let element of array) {
      if (element.id === currentID) {
        if (moment(element.start).isBefore(moment(time))) {
          startTime = element.start;
        }
      }
    }
    return startTime;
  }
  // find end  object
  findEndTime(array: any, time: any) {
    let endTime = time;
    let currentObj = this.findObject(array, time);
    let currentID = currentObj.id;
    for (let element of array) {
      if (element.id === currentID) {
        if (moment(element.start).isAfter(moment(time))) {
          endTime = element.start;
        }
      }
    }
    return endTime;
  }
  // check if end time event alreay in merged events
  inSide(array: any, element: any) {
    let exist = false;
    let start = moment(element.start);
    for (let x of array) {
      let s = moment(x.start);
      let e = moment(x.end);
      if (start.isSameOrAfter(s) && start.isSameOrBefore(e)) {
        exist = true;
      }
    }
    return exist;
  }
}
