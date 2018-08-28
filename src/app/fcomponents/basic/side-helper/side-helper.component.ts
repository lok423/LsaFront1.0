import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/fromEvent';
import { SideHelperService } from '../../../services/helpers/side-helper.service';

@Component({
  selector: 'app-side-helper',
  templateUrl: './side-helper.component.html',
  styleUrls: ['./side-helper.component.css']
})

export class SideHelperComponent implements OnInit {
  scrollStatus = false;
  textList = false;
  objectKeys = Object.keys;
  textObj = {};
  JSONfileExist = false;
  pathname: string;
  helperMatch: string;
  helperText: string;

  constructor(@Inject(WINDOW) private window: Window, 
    private router: Router,
    private http: HttpClient,
    private SideHelperService: SideHelperService,
  ) {
    router.events.subscribe((val) => {
      this.getPathname();
      this.cardInitContent();
    });
  }

  ngOnInit() { this.getHelperMatch(); }

  getPathname() {
    this.pathname = this.window.location.pathname;
    this.checkscrollStatus();
  }

  // Since sideHelper position is different from applyteach page and other user pages. For applyTeach page, its position is much belower.
  checkscrollStatus() {
    if (this.pathname === '/app/apply/teach') {
      $(this.window).scroll(() => { if ($(this.window).scrollTop() >= 300) { this.scrollStatus = true; } else { this.scrollStatus = false; } });
    } else {
      $(this.window).scroll(() => { if ($(this.window).scrollTop() >= 100) { this.scrollStatus = true; } else { this.scrollStatus = false; } });
    }
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/sideHelperData/' + this.pathname.split("/app/").pop() + '.json'); 
  }

  //check if components got JSONfile. In other words, if components need sideHelperInfo
  JSONfileCheck() {
    if (this.pathname==='/app/apply/manager' || this.pathname==='/app/apply/teach' || this.pathname==='/app/dashboard/tutor/editprofile/key' || this.pathname==='/app/dashboard/tutor/editprofile/cv' || this.pathname==='/app/dashboard/tutor/editprofile/speciality' || this.pathname==='/app/user/details' || this.pathname==='/app/user/password') {
      this.JSONfileExist = true;
    } else { this.JSONfileExist = false; }
    // console.log(this.JSONfileExist);
  }

  // define sideHelper initial content from JSON file 'initHelperMatch' and 'initHelperText'
  cardInitContent() {
    this.JSONfileCheck();
    if (this.JSONfileExist === true) {
      this.getJSON().subscribe(
        data => {
          if (data[0].pathname === this.pathname) {
            this.helperMatch = data[0].cardContent[0].initHelperMatch;
            this.helperText = data[0].cardContent[0].initHelperText;
          } else{ console.log('The pathname of current page is different from that of JSON file.'); }
        },
        error => { console.log(error); });
    } //else { console.log('This component does not have JSONfile since it does not have sideHelperPart.'); }
  }

  // once service observable changes, subscirbe its changes to get helperMatch.
  getHelperMatch(){
    this.SideHelperService.getObservableMessage().pipe(distinctUntilChanged()).subscribe(
      res => {
        this.helperMatch = res;
        this.getHelperText();
      },
      error => console.log(error),
    )
  }

  // once it has helperMatch, get helperText from JSON file. And if helperText is a multiple value obj, use *ngFor in HTML.
  getHelperText() {
    let i = 0;
    let j = 0;
    this.getJSON().subscribe(
      data => {
        for (i = 0; i < data[0].cardContent.length; i++) {
          if (this.helperMatch === data[0].cardContent[i].helperMatch) {
            if (typeof data[0].cardContent[i].helperText != "string"){
              this.textList = true;
              this.textObj = data[0].cardContent[i].helperText;
            } else{
              this.textList = false;
              this.helperText = data[0].cardContent[i].helperText;
            }
          }
        }
      },
      error => console.log(error),
    );
  }

}