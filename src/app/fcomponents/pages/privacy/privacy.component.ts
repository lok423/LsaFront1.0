import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {
    this.meta.addTags([
      { name: 'keywords', content: 'Learnspace, tutoring, tutors, wellington tutors, auckland tutors'},
      { name: 'description', content: 'Learnspace Privacy' },
      ])
    this.titleService.setTitle('Learnspace | Privacy' );
   }

  ngOnInit() {
  }

}
