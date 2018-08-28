import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarSupportService {
  constructor() { }
  // change data to the events format
  first(res) {
    console.log(res);
    let sessionEvents: any = [];
    let freeEvents: any = [];
    // tslint:disable-next-line:forin
    for (let date in res) {
      //console.log(date);
      if (res[date] !== null) {
        //console.log(res[date]);
        // free property and get free array
        //console.log(res[date]['free']);
        let freeTime = res[date]['free'];
        //console.log(freeTime);
        // tslint:disable-next- line:forin
        // start processing all the session data
        for (let sessionID in res[date]) {
          if (sessionID !== 'free') {
            let sessionObject = res[date][sessionID];
            let studentName = sessionObject.name;
            let sessionStatus = '';
            if (sessionObject['status']) {
              sessionStatus = sessionObject.status;
            }
            let sessionTime = sessionObject.time;
            //console.log(sessionTime);
            for (let sessionSlot of sessionTime) {
              // console.log(sessionSlot);
              let startTime = this.setTimeFormat(date, sessionSlot);
              let endTime = moment(startTime).add(30, 'minutes').format().substr(0, 19);
              let event = {
                id: sessionID,
                title: studentName + ' — ' + sessionStatus,
                start: startTime,
                end: endTime,
                color: '#0099ff'
              };
              sessionEvents.push(event);
              // delete the time from the free time, then the content in freetime will eventually become has no student
              this.deleteFromArray(freeTime, sessionSlot);
            }
          }
          }
        // end processing session date
        // start processing free time excluded the session time
        for (let free of freeTime) {
          let startTime = this.setTimeFormat(date, free);
          let endTime = moment(startTime).add(30, 'minutes').format().substr(0, 19);
          let event = {
            title: '',
            start: startTime,
            end: endTime,
            color: '#00ad2b'
          };
          freeEvents.push(event);
        }
        }
      }
    // this.showCalendar();
    let a = {
      session: sessionEvents,
      free: freeEvents
    };
    return a;
    }
  // delete an element from array
  deleteFromArray(array: any, element: any) {
    let index = array.indexOf(element);
    array.splice(index, 1);
  }
  // set time format time: 1030
  setTimeFormat(day: string, time: string): string {
    const hour = time.substr(0, 2);
    const minutes = time.substr(2);
    const timeFormat = day + 'T' + hour + ':' + minutes + ':00';
    return timeFormat;
  }
  // set the fullcalendar for rect selection
  // get multiple days events, used for add free time
  getMultipleDaysEvents(start: moment.Moment, end: moment.Moment, calendarEvents: any[], chooseWeeks: number) {
    console.log(start.format(), end.format());
    let theEvents = [];
    let duration = end.diff(start, 'days');
    let days = duration + 1;
    // console.log(start.format(), end.format(), days);
    for (let x = 0; x < days; x++) {
      let source = this.getOneDayEvents(start, end, chooseWeeks);
      theEvents = theEvents.concat(source);
      console.log(source, theEvents);
      start.add(1, 'days');
      end.add(1, 'days');
    }
    console.log(theEvents);
    // filter the duplicates events in the calendar
    let newEvents = this.removeDuplicates(calendarEvents, theEvents);
    console.log(newEvents);
    return newEvents;
  }
  // get events used for remove events
  getAllDaysEvents(start: moment.Moment, end: moment.Moment, calendarEvents: any[], chooseWeeks: number) {
    let theEvents = [];
    let duration = end.diff(start, 'days');
    let days = duration + 1;
    // console.log(start.format(), end.format(), days);
    for (let x = 0; x < days; x++) {
      let source = this.getOneDayEvents(start, end, chooseWeeks);
      theEvents = theEvents.concat(source);
      console.log(source, theEvents);
      start.add(1, 'days');
      end.add(1, 'days');
    }
    console.log(theEvents);
    return theEvents;
  }
  // get one day events, but several weeks(optional)
  getOneDayEvents(start: moment.Moment, end: moment.Moment, chooseWeeks: number) {
    let source = [];
        let endMinutes = end.hour() * 60 + end.minute();
        let startMinutes = start.hour() * 60 + start.minute();
        let timeSlots = (endMinutes - startMinutes) / 30;
        let sourceIndex = 0;
        // update weeks
        for (let j = 0; j < chooseWeeks; j++) {
          for (let i = 0; i < timeSlots; i++) {
            // check if already has this event, if not then add to sources
            let allEvents = $('#calendar').fullCalendar('clientEvents');
            source[sourceIndex] = {
              title: '',
              start: start.format(),
              end: start.add(30, 'minutes').format(),
              color: '#00ad2b',
            };
            sourceIndex++;
          }
          // make start go back to original
          start.subtract(timeSlots * 30, 'minutes');
          // go to next week
          start.add(7, 'days');
        }
        // make day to go back to original
        start.subtract(7 * chooseWeeks, 'days');
        console.log('y1', source);
        return source;
  }
  // check if alreday has the events
  exist(calendarEvents: any[], newEvent: any) {
    for (let event of calendarEvents) {
      if (event.start.format() === newEvent.start) {
        return true;
      }
    }
    return false;
  }
  // remove duplicates
  removeDuplicates(calendarEvents: any[], allNewEvents: any[]) {
    let newArray = [];
    for (let newEvent of allNewEvents) {
      if (!this.exist(calendarEvents, newEvent)) {
        newArray.push(newEvent);
      }
    }
    return newArray;
  }
}
