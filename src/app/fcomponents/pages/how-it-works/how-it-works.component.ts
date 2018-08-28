import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {
    this.meta.addTags([
      { name: 'keywords', content: 'how it works, Learnspace, tutoring, tutors'},
      { name: 'description', content: 'Learnspace How it works' },
        ])
    this.titleService.setTitle('Learnspace | How it works');
   }

  ngOnInit() {
  }

}
