import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-resources-create-display-card',
  templateUrl: './resources-create-display-card.component.html',
  styleUrls: ['./resources-create-display-card.component.css']
})
export class ResourcesCreateDisplayCardComponent implements OnInit {

  @Input() displayTag: string;
  @Input() displayTitle: string;
  @Input() displayContent: string;
  @Input() displayImg: string;
  @Input() smallScreen: boolean;
  display: Window;
  
  constructor(
    @Inject(WINDOW) 
    private window: Window, 
  ) {
    this.display = window
   }

  ngOnInit() {
  }

}
