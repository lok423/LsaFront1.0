import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject, PLATFORM_ID } from '@angular/core';
import { GeneralService } from '../../../services/servercalls/general.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SearchTutorModel } from '../../../models/SearchTutorModel';
import { TutorProfileModel } from '../../../models/TutorProfileModel';
import { MatDialog } from '@angular/material';
import { ContactDialogComponent } from '../../basic/contact-dialog/contact-dialog.component';
import { CalendarSupportService } from '../../../services/support/calendar-support.service';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment.prod';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { CommonSupportService } from '../../../services/support/common-support.service';

@Component({
  selector: 'app-tutorprofile',
  templateUrl: './tutorprofile.component.html',
  styleUrls: ['./tutorprofile.component.css']
})
export class TutorprofileComponent implements OnInit {
  id: string;
  tutor: SearchTutorModel;
  tutorprofile: TutorProfileModel;
  tutorfeedback: any;
  firstname: string;
  cleanVideo: any;
  errorMessage: string;
  tutor_photo: string;
  eventContainer = {
    session: [],
    free: [],
  };
  // baseImgUrl = environment.baseImgUrl + '/tutorimg/';

  events: any = [];// session object

  constructor(
    @Inject(PLATFORM_ID)
    private platformId,
    @Inject(WINDOW) 
    private window: Window, 
    private route: ActivatedRoute,
    public searchService: GeneralService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private calendar: CalendarSupportService,
    private router: Router,
    private meta: Meta,
    private titleService: Title,

    private commonSupport: CommonSupportService
  ) {
    // Meta Area
    this.meta.addTags([
      { name: 'keywords', content: 'tutors, Learnspace, tutoring, tutors, wellington tutors, auckland tutors'},
      { name: 'description', content: 'Find the best high school tutors in Wellington and Auckland' },
      ])
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getTutorData(this.id);
    this.popoverBook();
    this.stickySideBar();
  }

  getTutorData(id) {
    this.searchService.showTutor(id).subscribe(
      (res) => { this.setPageData(res) },
      (err) => { this.errorMessage = "Something went wrong, we cannot get any data at this time." }
    )
  }

  setPageData(res) {
    console.log(res)
    this.tutor = res['data'].thisTutorInfo;
    // Meta area
    this.meta.addTags([{name: 'keywords', content: this.tutor.discipline+' tutor, '+this.tutor.curriculum+' tutor'}])
    this.titleService.setTitle('Learnspace | '+this.tutor.first_name);

    this.tutorprofile = res['data'].thisTutorProfile;
    this.tutorfeedback = res['data'].thisTutorFeedback;
    // this.tutor['profile_photo'] = this.baseImgUrl + this.tutor['profile_photo']
    this.tutor['profile_photo'] = this.commonSupport.findUserImg(this.tutor['user_id']) + "?ver=" + this.commonSupport.getTime();

    this.cleanVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.tutor.profile_video)

    this.eventContainer = this.calendar.first(res['data'].thisTutorSchedule);
    if (this.eventContainer.free.length > 0) { this.tutorScheduleInit(this.eventContainer) }
  }

  tutorScheduleInit(eventContainer) {
    // Client Only Codes
    if (isPlatformBrowser(this.platformId)) {
      this.eventContainer = eventContainer
      $('#calendar1').css({ 'display': 'block' });
      this.events = this.eventContainer.free;
      for (let i = 0; i < this.events.length; i++) {
        //delete the free time that before current time
        let eve = this.events[i];
        if (moment(eve.end).isBefore(moment())) {
          delete this.events[i];
          this.events.splice(i, 1);
          i = i - 1;
        }
      }
      this.processMethod();
    }
  }

  //book button
  bookNow($event) {
    if (this.eventContainer.free.length > 0) {//if tutor has free time
      this.router.navigate(['./app/find-tutor/profile/' + this.tutor.tutor_id + '/book']);
    } else {//if tutor didn't edit hir free time
      let dialogRef = this.dialog.open(ContactDialogComponent, {
        width: '700px',
        data: this.tutor.first_name
      });
    }
  }
  //routerlink to book sessions via popover
  popoverBook() {
    if (isPlatformBrowser(this.platformId)) {
      $(() => {
        $(document).on('click', '#button', () => {
          let startTime = $('#popoverTime').html().substr(23, 5);
          let tempDate = $('#popoverDate').html().substr(23, 11);
          let stTime = tempDate + 'T' + startTime + ':00';
          console.log(stTime);
          this.router.navigate(['./app/find-tutor/profile/' + this.tutor.tutor_id + '/book'], { queryParams: { dTime: stTime } });
        });
      });
    }
  }
  //make sidebar sticky on top
  stickySideBar() {
    // Client only code.
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function() {
        $("#sideBar").addClass("fixed");
        let div_top = $('#sideBar').offset().top;
        $(this.window).scroll(function() {
          let scrollTop = $(this.window).scrollTop();
          let footer_top = $("app-footer").offset().top;
          let div_height = $("#sideBar").height();
          if (scrollTop + div_height + 70 > footer_top) {
            $("#sideBar").removeClass("fixed")
          } else if (scrollTop - 70 >= div_top) {
            $("#sideBar").addClass("fixed")
          }
        })
      });
    }
  }

  processMethod() {
    console.log(this.eventContainer.free);
    let fcSources = { events2: this.eventContainer.free };
    let today = moment().day();
    $('#calendar').fullCalendar({
      header: {
        left: '',
        center: 'prev title next',
        right: 'today',
      },
      themeSystem: 'bootstrap3',
      defaultView: 'agendaWeek',
      firstDay: today,
      aspectRatio: 1.09,
      navLinks: true,
      displayEventTime: false,
      eventSources: [fcSources.events2],
      allDaySlot: false,
      height: 'parent',
      minTime: moment.duration('08:00:00'),
      maxTime: moment.duration('21:00:00'),
      viewRender: function(view, element) {//set the button in header
        $('.fc-today-button').css({ 'position': 'relative', 'bottom': '65px', 'font-size': '15px', 'background-color': '#0099FF', 'color': 'white', 'font-weight': 'bold' });
        $('.fc-prev-button').css({ 'position': 'absolute', 'top': '13%', 'left': '5%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white' });//
        $('.fc-prev-button').text('<');
        $('.fc-center h2').css({ 'font-size': '25px', 'color': '#525252', 'font-weight': 'bold' });
        $('.fc-next-button').css({ 'position': 'absolute', 'top': '13%', 'right': '5%', 'height': '30px', 'width': '30px', 'border-radius': '100%', 'font-size': '15px', 'color': '#0099FF', 'font-weight': 'bold', 'border': '2px solid #0099FF', 'background-color': 'white' });
        $('.fc-next-button').text('>');
        if (moment(view.start).isBefore(moment().add(1, 'days'))) {
          $(".fc-prev-button").prop('disabled', true);
          $(".fc-prev-button").addClass('fc-state-disabled');
        } else {
          $(".fc-prev-button").removeClass('fc-state-disabled');
          $(".fc-prev-button").prop('disabled', false);
        }
      },
      eventAfterRender: function(event, element, view) {
        $(element).css({ 'font-size': '13px', 'border-radius': '0px', 'border': '0.1px solid white', 'margin': '0px' });// 'margin-top':'0.5px'
      },
      eventRender: function(event, element, view) {   //render how event look like
        let x = event.start as moment.Moment;
        let y = event.end as moment.Moment;
        let startTime = x.format().substr(11, 5);
        let endTime = y.format().substr(11, 5);
        let date = x.format().substr(0, 10);
        console.log(date);
        if (event.color === '#00ad2b') {
          (element as any).popover({
            title: event.title,
            selector: '.popover',
            container: '#calendar', // the popover now is one part of the element, append the popover on the element
            html: true, // allow the content to be html
            content: '<p id="popoverDate"><strong>Date: </strong>' + date + '</p>' + '<p id="popoverTime"><strong>Time: </strong>' + startTime + ' - ' + endTime + '</p>' + '<button id="button" class="btn btn-primary btn-block">Book Session</button>',
            trigger: 'manual',
            placement: 'left'
          }).on('mouseenter', function() {
            let this1 = this;
            ($(this) as any).popover('show');
            $('.popover').on('mouseleave', function() {
              ($(this1) as any).popover('hide');
            });
          }).on('mouseleave', function() {
            let this2 = this;
            setTimeout(function() {
              if (!$('.popover:hover').length) {
                ($(this2) as any).popover('hide');
              }
            }, 1);
          });
        }
        $('.fc-body .fc-row').css({ 'min-height': '25px' });// calendar minimum height
        $('span').css({ 'font-size': '13px', 'color': '#525252' });//global grid text size
        $('span.fc-day-number').css({ 'font-size': '12px', 'color': '#525252' });//calendar date number
      },
    });
  }
}
