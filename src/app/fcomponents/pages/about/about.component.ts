import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {
    this.meta.addTags([
      { name: 'keywords', content: 'about, Learnspace, tutoring, about us, tutors'},
      { name: 'description', content: 'Learnspace About us' },
        ])
    this.titleService.setTitle('Learnspace | About');
  }

  ngOnInit() {
  }

}
