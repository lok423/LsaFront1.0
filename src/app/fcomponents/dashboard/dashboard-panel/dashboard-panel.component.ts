import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})

export class DashboardPanelComponent implements OnInit {

  constructor(
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
  ) {
  }
  ngOnInit() {
  }
}