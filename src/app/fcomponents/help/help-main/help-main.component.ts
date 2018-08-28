import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-help-main',
  templateUrl: './help-main.component.html',
  styleUrls: ['./help-main.component.css']
})
export class HelpMainComponent implements OnInit {

  isBrowser=false

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private meta: Meta,
    private titleService: Title
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true
    }
    this.meta.addTags([
      { name: 'keywords', content: 'Tutoring, tutoring jobs, Learnspace, tutors, NCEA tutors, Maths tutors, English tutors, best maths tutors, best tutors'},
      { name: 'description', content: 'Learnspace Home, find the best high school tutors in Wellington and Auckland' }
    ])
    this.titleService.setTitle('Learnspace | Help');
   }

  ngOnInit() {
  }

}