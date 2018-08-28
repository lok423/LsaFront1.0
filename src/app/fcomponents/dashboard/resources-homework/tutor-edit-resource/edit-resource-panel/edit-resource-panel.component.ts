import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, OnDestroy , Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ResourceRepositoryService } from '../../../../../services/repositories/resource-repository.service';

import { ResourcesAddData } from './resources-add-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-resource-panel',
  templateUrl: './edit-resource-panel.component.html',
  styleUrls: ['./edit-resource-panel.component.css']
})
export class EditResourcePanelComponent implements OnInit, OnDestroy {

  resourcePropertySubscription: Subscription;

  // resources action
  resAction: string;
  displayCardData: any[] = ResourcesAddData;
  display: Window;
  
  constructor(
    @Inject(WINDOW) 
    private window: Window, 
    private router: Router,
    private route: ActivatedRoute,
    private resourceCtrlService: ResourceRepositoryService,
  ) {
    this.display = window
   }

  ngOnInit() {
    let currentUrl = this.defineCurrentUrl();
    if(currentUrl.indexOf("/add") != -1) { // add resources
      this.resAction = "add";
    } else if(currentUrl.indexOf("/edit") != -1) { // edit resources
      this.resAction = "edit";
      this.resourcePropertySubscription = this.resourceCtrlService.resourceProperty.subscribe(
        msg => {
          if(Object.keys(msg).length != 0) {
            if(msg['op'] == "edit") { // edit homework operation
              let resourceValue = msg['value'];
              // send homework information to homework related components for Editing
              if(resourceValue.resource_type == "homework") {
                this.resourceCtrlService.sendHomeworkInfo(resourceValue, "edit");
                this.router.navigate(['homework'], { relativeTo: this.route });
              }
            }
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    console.log("<<EditResourcePanelComponent>> [ngOnDestroy]");
    if(this.resAction == "edit") {
      this.resourcePropertySubscription.unsubscribe();
    }
  }

  // define component current url
  defineCurrentUrl() {
    return this.router.url;
  }

}
