import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-details-panel',
  templateUrl: './user-details-panel.component.html',
  styleUrls: ['./user-details-panel.component.css']
})
export class UserDetailsPanelComponent implements OnInit {

  constructor(
    private titleService: Title,
  ) {
    this.titleService.setTitle('User Details');
   }

  ngOnInit() {
  }

}
