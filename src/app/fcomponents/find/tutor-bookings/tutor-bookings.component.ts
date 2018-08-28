import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarSupportService } from '../../../services/support/calendar-support.service';
import { LearnerService } from '../../../services/servercalls/learner.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tutor-bookings',
  templateUrl: './tutor-bookings.component.html',
  styleUrls: ['./tutor-bookings.component.css']
})
export class TutorBookingsComponent implements OnInit {
  newArray = [];//temparary session container for further pick up
  allSessions = [];
  showWarningMes = false;//operation indicator
  eightLimitMes = false //8 sessions limit indicator
  indicator = false; // for page loading indicator message
  feedback: string;//the feedback messsage when user click checkout
  billNum=0; //for cart display totolly money
  savedBillNum:number;//for cart display totolly saved money
  tutorPrice= [];  //for money calculation
  subjects=[];//subjects view
  curriculums=[];//curriculum view
  locations=[];//location view
  tutorId:string;
  userId:string;
  tutorProfileId:string;
  startTime=[];
  preDate: any;//when user click via book popover
  session={
    date_time:'',
    duration: 0,
    rate: [],
    subject: '',
    curriculum: '',
    location: '',
  };
  sessions = [];
  events: any = [];// session object
  eventContainer ={
    session:[],
    free:[],
  };
  constructor(
    @Inject(LOCAL_STORAGE) 
    private localStorage: any, 
    private calendarService: CalendarSupportService,
    private learnerService: LearnerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{   this.tutorProfileId = params['id'];  });
    this.route.queryParams.subscribe(params=>{    this.preDate = params['dTime'];   });
    console.log(this.preDate);
    this.getTutorData();
    this.addLessonPop();
    this.deleLessonPop();
    
  }
  //subscribe data from the server
  getTutorData(){
    this.learnerService.showTutor(this.tutorProfileId).subscribe(
      (res) => {  
        this.setTutorData(res);
        //set initial session data via 'book session' popover
        console.log(this.preDate);
        if(this.preDate){
          let x=this.preDate
          let allEvents = $('#calendar').fullCalendar('clientEvents',function(e){   
            return (e.start.format()==x)   });
          if(allEvents[0]){  this.addLesson(allEvents[0]);  }
        }
      },
      (error) => console.log(error)
    )
  }
  //set the tutor data and schedule data
  setTutorData(res){
    console.log(res);
    let data=res['data'].thisTutorInfo;    
    this.subjects = data.discipline.split(",");
    this.curriculums = data.curriculum.split(",");
    this.locations = res['data'].thisTutorProfile.teaching_locations;
    this.session.subject=this.subjects[0];
    this.session.curriculum=this.curriculums[0];
    this.session.location=this.locations[0];
    this.session.rate.push(data.price_1,data.price_2);
    this.tutorPrice = this.session.rate;

    this.tutorId = data.user_id.toString();
    this.userId = this.localStorage.getItem('lsaUserId');
    console.log(this.tutorId,this.userId);
    //set the schedule data for calendar
    this.eventContainer=this.calendarService.first(res['data'].thisTutorSchedule);
    this.events=this.eventContainer.free;
    for(let i=0; i<this.events.length; i++){//delete the free time that before current time
      let eve=this.events[i];
      if(moment(eve.end).isBefore(moment())){
        delete this.events[i];
        this.events.splice(i,1);
        i=i-1;
      }
    }
    this.indicator=true;
    this.events.forEach(element => {//set for popover validation
      this.startTime.push(element.start);
    });
    console.log(this.startTime);
    this.calendarHome(this.events);
  }
  // set time format time: 1030
  setTimeFormat(day: string, time: string): string {
    const hour = time.substr(0, 2);
    const minutes = time.substr(2);
    const timeFormat = day + 'T' + hour + ':' + minutes + ':00';
    return timeFormat;
  }
  //change the value in cart via select button
  change(x){
    let selected = event.srcElement['value'];
    for(let i=0; i<this.sessions.length; i++){
      let t=this.sessions[i];
      let duration=t.s_duration*2;
      for(let i=0; i<duration; i++){
        for(let k=0; k<this.newArray.length; k++){
          let tt=this.newArray[k];
          if(x.date==tt.time){
            if(x.item==tt.subject){  tt.subject=selected;  break;}
            if(x.item==tt.curriculum){  tt.curriculum=selected;  break;}
            if(x.item==tt.location){   tt.location=selected;  break;}
          }
        }
        for(let j=0; j<this.events.length; j++){
          if(x.date==this.events[j].start && this.events[j].color=='#00ddff'&&x.item==t.s_subject){
            this.events[j].title=selected;
            console.log(this.events[j],t.s_subject);
          }
        }
        x.date=moment(x.date).add(30,'minutes').format().substr(0,19);
      };
      x.date=moment(x.date).subtract(30*duration,'minutes').format().substr(0,19);
    }
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar( 'addEventSource', this.events);
    this.setSessions();
    this.setBill();
  }
  //add lesson in popover
  addLessonPop(){
    $(()=> {
      $(document).on('click', '#button2', ()=> {
      let startTime = $('#popoverTime2').html().substr(23, 5);
      let tempDate= $('#popoverDate2').html().substr(23, 11);
      let stTime=tempDate+'T'+startTime+':00';
      let allEvents = $('#calendar').fullCalendar('clientEvents',function(e){
        return (e.start.format()==stTime)
      });
      console.log(allEvents)
      let e=allEvents[0];
      this.addLesson(e);
      });
    });
  }
  //delete lesson in popover
  deleLessonPop(){
    $(()=> {
      $(document).on('click', '#button', ()=> {
      let startTime = $('#popoverTime').html().substr(23, 5);
      let endTime = $('#popoverTime').html().substr(31, 6);
      let tempDate= $('#popoverDate').html().substr(23, 11);
      let stTime=tempDate+'T'+startTime+':00';
      let edTime=tempDate+'T'+endTime+':00';
      console.log(tempDate,startTime,endTime,stTime,edTime,this.events);
      let end=moment(edTime).subtract(30,'minutes').format().substr(0,19);
      let dura = 4;
      $('.popover').remove();
      this.feedback=null;
      this.deleLesson(stTime,dura);
      });
    });
  }
  //show book lesson popover
  showBookPop(event,element){
    let x = event.start as moment.Moment;
    let test = event.end as moment.Moment;
    let y;
    if(this.startTime.includes(test.format())){
      y = (event.end as moment.Moment).add(30, 'minutes');
    }else{  y = (event.end as moment.Moment); };
    let startTime = x.format();
    let endTime = y.format();
    let date = x.format().substr(0, 10);
    if (event.color ==='#00ad2b') {
      (element as any).popover({
        title: this.session.subject,
        selector: '.popover',
        container: '#calendar', // the popover now is one part of the element, append the popover on the element
        html: true, // allow the content to be html
        content: '<p id="popoverDate2"><strong>Date: </strong>' + date + '</p>' + '<p id="popoverTime2"><strong>Time: </strong>' + startTime.substr(11,5) + ' - ' + endTime.substr(11,5) + '</p>' + '<button id="button2" class="btn btn-primary btn-block">Book Session</button>',
        trigger: 'manual',
        placement: 'left'
      }).on('mouseenter', function() {
        let this1 = this;
        ($(this) as any).popover('show');
        $('.popover').on('mouseleave', function() {
          ($(this1) as any).popover('hide');
        });
      }).on('mouseleave', function() {
        let this1 = this;
        setTimeout(function() {
          if (!$('.popover:hover').length) {
            ($(this1) as any).popover('hide');
          }
        }, 1);
      });
    }
  }
  //show delete lesson popover
  showDeletePop(event, element){
    let x = event.start as moment.Moment;
    let y = event.end as moment.Moment;
    let startTime = x.format();
    let date = x.format().substr(0, 10);
    if (event.color === '#00ddff') {
      let startObj = this.findStartObj(this.newArray, startTime);
      let endObj = this.findEndObj(this.newArray, startTime);
      console.log(this.newArray);
      let start = startObj.time.substr(11, 5);
      let end = endObj.time;
      end = moment(end).add(30, 'minutes').format();
      end = end.substr(11, 5);
      (element as any).popover({
        title: event.title,
        selector: '.popover',
        container: '#calendar', // the popover now is one part of the element, append the popover on the element
        html: true, // allow the content to be html
        // tslint:disable-next-line:max-line-length
        content: '<p id="popoverDate"><strong>Date: </strong>' + date + '</p>' + '<p id="popoverTime"><strong>Time: </strong>' + start + ' - ' + end + '</p>' + '<button id="button" class="btn btn-primary btn-block">Delete</button>',
        trigger: 'manual',
        placement: 'left'
      }).on('mouseenter', function() {
        let this1 = this;
        ($(this) as any).popover('show');
        $('.popover').on('mouseleave', function() {
          ($(this1) as any).popover('hide');
        });
      }).on('mouseleave', function() {
        let this1 = this;
        setTimeout(function() {
          if (!$('.popover:hover').length) {
            ($(this1) as any).popover('hide');
          }
        }, 50);
      });
    }
  }
  //delete lesson method
  deleLesson(time,dura){
    let duration=dura*2;
    for(let i=0; i<duration; i++){
      for(let j=0; j<this.events.length; j++){
        if(time==this.events[j].start){
          this.events[j].color='#00ad2b';
          this.events[j].title='';
        }
      }
      for(let k=0; k<this.newArray.length; k++){
        let tt=this.newArray[k];
        if(time==tt.time){
          delete this.newArray[k];
          this.newArray.splice(k,1);
          k=k-1;
        }
      }
      time=moment(time).add(30,'minutes').format().substr(0,19);
    }
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar( 'addEventSource', this.events);
    this.setSessions();
    this.setBill();
    this.feedback=null;
  }
  //add lesson method
  addLesson(e){
    $('.popover').remove();
    this.eightLimitMes=false;
    this.feedback=null;
    let cloned = this.newArray.map(x => Object.assign({}, x));
    let mySessions = this.seperateSession(cloned);
    // every time we need to reset allsessions
    this.allSessions = [];
    if(mySessions.length<8 && e.color ==='#00ad2b'){
      let start = e.start;
      let current = (start as moment.Moment).format();
      let next = (e.start as moment.Moment).add(30, 'minutes').format();
      // already add 30 minutes, so subtract 60 minutes will be previous
      let previous = (e.start as moment.Moment).subtract(60, 'minutes').format();
      // add to object to array first, if valid then update color, else remove fro
      // user choose the time
      if (this.newArray.length === 0 && this.exist(this.events, next)) {
        // the user choosed nothing
        this.changeColor(this.events, current, '#00ddff');
        this.pushToArray(this.newArray, current);
        this.changeColor(this.events, next, '#00ddff');
        this.pushToArray(this.newArray, next);
        this.showWarningMes = false;
      } else {
        // check every one is valid or not
        this.pushToArray(this.newArray, current);
        if (!this.onlyHerself(this.newArray, current)) {
          this.changeColor(this.events, current, '#00ddff');
          // this.pushToArray(this.newArray, current);
          this.showWarningMes = false;
        } else {
          if (this.exist(this.events, next) && !this.selected(this.events, next)) {
            this.changeColor(this.events, current, '#00ddff');
            // this.pushToArray(this.newArray, current);
            this.changeColor(this.events, next, '#00ddff');
            this.pushToArray(this.newArray, next);
            this.showWarningMes = false;
          } else {
            this.showWarningMes = true;
            this.deleteFromArray(this.newArray, current);
          }
        }
      }
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar( 'addEventSource', this.events);
      this.setSessions();
      this.setBill();
    }else{
      if(mySessions.length==8){ this.eightLimitMes=true }
    }
  }
  //set summary bill
  setBill(){
    this.billNum=0;
    this.savedBillNum=0;
    for(let i=0; i<this.sessions.length; i++){
      let x=this.sessions[i];
      if(x.s_duration<2){
        this.billNum = this.billNum+ this.session.rate[0]*x.s_duration;
      }else{
        this.billNum = this.billNum+ this.session.rate[1]*x.s_duration;
        this.savedBillNum = this.savedBillNum+x.s_duration*(this.session.rate[0]-this.session.rate[1]);
      }
    }
  }
  // when user click checkout button to submit 
  checkOut(){
    console.log(this.sessions);
    //check if the userId equel the tutorId first
    if(this.sessions.length==0){
      this.feedback="Please book lessons first.";
    }else if(this.tutorId===this.userId){
              this.feedback="You cannot book your own free time.";
          }else{
            this.learnerService.storeLearnerSessions(this.tutorProfileId,this.sessions).subscribe(
              (res)=>{console.log(res); this.feedback='Succeed!'},
              (error)=>{console.log(error); }
            )
          }
  }
  // let the user to set session information like subject, curriculum and location
  setInfo(x){
    let selected = event.srcElement.innerHTML;
    $(x.btn).html(selected);
    if(x.item==='subject'){this.session.subject=selected;}
    if(x.item==='curriculum'){this.session.curriculum=selected;}
    if(x.item==='location'){this.session.location=selected;}
  }
  //set the sessions object value for subscription
  setSessions(){
    let cloned = this.newArray.map(x => Object.assign({}, x));
    let mySessions = this.seperateSession(cloned);
    // every time we need to reset allsessions
    this.allSessions = [];
    this.sessions=[];
    for(let s of mySessions){
      let se={
        s_date:'',
        s_duration: 0,
        s_subject: '',
        s_curriculum: '',
        s_location: '',
        s_times:[],
      };
      se.s_date=s[0].time;
      se.s_duration=s.length/2;
      se.s_subject=s[0].subject;
      se.s_curriculum=s[0].curriculum;
      se.s_location=s[0].location;
      this.sessions.push(se);
    }
    // for loop to generate the all start time array
    for(let i =0; i < this.sessions.length; i++) {
      let dura = this.sessions[i].s_duration * 2;
      for(let j =0; j < dura; j++) {
        let t =30 * j;
        let temp =moment(this.sessions[i].s_date).add(t,'minutes').format();
        let time =temp.substr(11,2) + temp.substr(14,2);
        if(this.sessions[i].s_times.length > 0) {
          if(!this.sessions[i].s_times.includes(time)) {
            this.sessions[i].s_times.push(time);
          }
        } else {
          this.sessions[i].s_times.push(time);
        }
      }
    }
    console.log(this.sessions);
  }
  // main function to render the calendar
  calendarHome(myevents) {
    let today = moment().day();
    $('#calendar').fullCalendar({
      header: {
        left: '',
        center: 'prev title next',
        right: 'today'
      },
      themeSystem: 'bootstrap3',
      height: 'parent',
      defaultView: 'agendaWeek',
      firstDay: today,
      events: myevents,
      selectable: false,
      eventOverlap: false,
      displayEventTime: false,
      unselectAuto: false,
      allDaySlot: false,
      selectOverlap: false,
      minTime: moment.duration('08:00:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function(view, element) {//set the button in header
        $('.fc-today-button').css({'position': 'absolute', 'top': '11px', 'right': '6%', 'font-size': '15px', 'background-color': '#0099FF', 'color': 'white', 'font-weight': 'bold'});
        $('.fc-prev-button').css({'position': 'absolute', 'left': '8%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white'}); //
        $('.fc-prev-button').text('<');
        $('.fc-center h2').css({'font-size': '25px', 'color': '#525252', 'font-weight': 'bold'});
        $('.fc-next-button').css({'position': 'absolute', 'right': '8%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white'});
        $('.fc-next-button').text('>');
        if(moment(view.start).isBefore(moment().add(1,'days'))) {
          $(".fc-prev-button").prop('disabled', true); 
          $(".fc-prev-button").addClass('fc-state-disabled'); 
        } else {
          $(".fc-prev-button").removeClass('fc-state-disabled'); 
          $(".fc-prev-button").prop('disabled', false); 
        }
      },
      eventAfterRender: function(event, element, view) {// style the events
        $(element).css({'font-size': '13px', 'border-radius': '0px', 'border': '0.1px solid white', 'margin': '0px'});
      },
      eventRender: (event, element, view) => {   //render how event look like
        this.showDeletePop(event,element);
        this.showBookPop(event,element);
        $('span.fc-day-number').css({'font-size': '12px', 'color': '#525252'}); //calendar date number
      },
      eventClick: (e, jsEvent, view) => {
        this.addLesson(e);
      },
    });
  }
  // event extist
  selected(array: any, time: any) {
    for (let event of array) {
      if (event.start === time) {
        if (event.color === '#00ddff') {
          return true;
        }
      }
    }
    return false;
  }
  // event extist
  exist(events: any, selected: string): boolean {
    for (let event of this.events) {
      let x = event.start;
      if ( x === selected) {
        return true;
      }
    }
    return false;
  }
  // check two object same
  sameObject(Object1: any, Object2: any) {
    // tslint:disable-next-line:max-line-length
    if (Object1.time === Object2.time && Object1.subject === Object2.subject && Object1.location === Object2.location && Object1.curriculum === Object2.curriculum) {
      return true;
    }
    return false;
  }
  // create an object using time
  createObject(time: any) {
    let subject = this.session.subject.replace(/\s/g,'');
    let location = this.session.location;
    let curriculum = this.session.curriculum;
    let myObject = {
      time: time,
      subject: subject,
      location: location,
      curriculum: curriculum
    };
    return myObject;
  }
  // get session between two date object
  getSession(startObj: any, endObj: any) {
    let start = startObj.time;
    let end = endObj.time;
    let start1 = moment(start);
    let end1 = moment(end);
    let duration = moment.duration(end1.diff(start1));
    // because 12: 00 to 12:30 is only 1230-1200 = 30 , but it is actually 2 slots, so plus 1
    let slots = duration.asHours() * 2 + 1;
    let session = [];
    for (let i = 0; i < slots; i++) {
      let time = start1.format().substr(0, 19);
      let myObj = {
        time: time,
        subject: startObj.subject,
        location: startObj.location,
        curriculum: startObj.curriculum
      };
      session.push(myObj);
      start1 = moment(start1.add(30, 'minutes').format());
    }
    return session;
  }
  // seperate array to sessions
  seperateSession(array: any) {
     // copy an exactly same array
     // set the exit point
     if (array.length === 0) {
      return this.allSessions;
    }
    let firstElement = array[0];
    let firstTime = firstElement.time;
    let startObj = this.findStartObj(array, firstTime);
    let endObj = this.findEndObj(array, firstTime);
    // add the session to the session array
    let session = this.getSession(startObj, endObj);
    this.allSessions.push(session);
    // delete session object from the array
    for (let x of session) {
      // find the object
      let myTime = x.time;
      let myObj = this.findObject(array, myTime);
      this.calendarService.deleteFromArray(array, myObj);
    }
    return this.seperateSession(array);
  }
  // check if only himselft
  onlyHerself(array: any, time: any) {
    let startObj = this.findStartObj(array, time);
    let endObj = this.findEndObj(array, time);
    if (this.sameObject(startObj, endObj)) {
      return true;
    }
    return false;
  }
  // delete from array
  deleteFromArray(array: any, time: any) {
    let myObject = this.createObject(time);
    let x = array.indexOf(myObject);
    array.splice(x, 1);
  }
  // push to new array
  pushToArray(array: any, time: any) {
    let myObject = this.createObject(time);
    array.push(myObject);
  }
  findObject(array: any, time: any) {
    for (let element of array) {
      if (element.time === time) {
        return element;
      }
    }
  }
  // findStart object
  findStartObj(array: any, time: any) {
    let currentObj = this.findObject(array, time);
    let previous = moment(time).subtract(30, 'minutes').format().substr(0, 19);
    // create an object has same location subject etc
    let myObject = {
      time: previous,
      subject: currentObj.subject,
      location: currentObj.location,
      curriculum: currentObj.curriculum
    };
    let exist = false;
    for (let x of array) {
      if (this.sameObject(x, myObject)) {
        exist = true;
      }
    }
    if (exist === false) {
      let x = moment(previous).add(30, 'minutes').format().substr(0, 19);
      let y = {
        time: x,
        subject: currentObj.subject,
        location: currentObj.location,
        curriculum: currentObj.curriculum
      };
      return y;
    }
    return this.findStartObj(array, previous);
  }
   // findStart object
   findEndObj(array: any, time: any) {
    let currentObj = this.findObject(array, time);
    let next = moment(time).add(30, 'minutes').format().substr(0, 19);
    let myObject = {
      time: next,
      subject: currentObj.subject,
      location: currentObj.location,
      curriculum: currentObj.curriculum
    };
    let exist = false;
    for (let x of array) {
      if (this.sameObject(x, myObject)) {
        exist = true;
      }
    }
    if (exist === false) {
      let x = moment(next).subtract(30, 'minutes').format().substr(0, 19);
      let y = {
        time: x,
        subject: currentObj.subject,
        location: currentObj.location,
        curriculum: currentObj.curriculum
      };
      return y;
    }
    return this.findEndObj(array, next);
  }
  // change the color for an event
  changeColor(events: any, startdate: any, myColor: any) {
    for (let arrayEvent of events) {
      let arrayStart = arrayEvent.start;
      if (arrayStart === startdate) {
        arrayEvent.color = myColor;
        arrayEvent.title = this.session.subject;
        break;
      }
    }
  }
}