import { Component, OnInit, ViewChildren,} from '@angular/core';
import { FindMainComponent } from '../find-main/find-main.component';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-find-panel',
  templateUrl: './find-panel.component.html',
  styleUrls: ['./find-panel.component.css']
})
export class FindPanelComponent implements OnInit, AfterViewInit {
  @ViewChildren(FindMainComponent) fmc: FindMainComponent
  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {
    this.meta.addTags([
      { name: 'keywords', content: 'find tutors, Learnspace, tutoring, tutors, maths help, maths tutor, english tutor, science tutor, physics tutor, chemistry tutor, bio tutor, accounting tutor, french tutor, economics tutor, calculus tutor, wellington tutor, auckland tutor'},
      { name: 'description', content: 'Find the best high school tutors in Wellington and Auckland' },
      ])
    this.titleService.setTitle('Learnspace | Find tutors');
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
  }

}