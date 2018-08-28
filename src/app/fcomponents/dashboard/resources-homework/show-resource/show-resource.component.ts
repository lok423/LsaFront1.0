import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, OnDestroy , Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TutorService } from '../../../../services/servercalls/tutor.service';
import { LearnerService } from '../../../../services/servercalls/learner.service';
import { ResourceRepositoryService } from '../../../../services/repositories/resource-repository.service';
import { ResourceDetails } from '../../../../models/HomeworkResourceModel';

import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-show-resource',
  templateUrl: './show-resource.component.html',
  styleUrls: ['./show-resource.component.css']
})
export class ShowResourceComponent implements OnInit, OnDestroy {

  resourcePageSubscription: Subscription;
  tutorResourceSubscription: Subscription;
  learnerResourceSubscription: Subscription;
  // viewer type
  viewerType: string;
  // resource page number
  resourcePage: number;
  resource: object;
  // resource content
  resourceContent: object;
  // resource type
  resourceType: string;
  // resource owner id
  resourceOwnerId: string;
  // resource owner
  isOwner: boolean;
  // resource public (1) or private (0)
  resourcePrivacy: number;
  imgBaseUrl: string = environment.baseImgUrl + "/resources/imgs/";
  resourceImage: string;
  authorImage: string = environment.baseUserImgUrl;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private learnerService: LearnerService,
    private resourceCtrlService: ResourceRepositoryService,
  ) { }

  ngOnInit() {
    this.defineViewerType();
    this.route.queryParams.subscribe(
      params => {
        let resourceId = params['id'];
        if(this.viewerType == "tutor") {
          this.tutorResourceSubscription = this.tutorService.showTutorResource(resourceId).subscribe(
            (res) => {
              this.resource = res['dataCon'].tutorStudyResource;
              this.resourcePrivacy = this.resource['isPublic'];
              this.resourceContent = JSON.parse(JSON.parse(this.resource['resource_body']));
              this.resourceOwnerId = this.resource['tutor_id'];
              this.defineResourceOwner();
              this.parseResourceContentType(this.resourceContent);
              // change image path
              this.resourceImage = this.imgBaseUrl + this.resource['resource_image'];
            },
            (err) => { console.log(err) }
          );
        } else if(this.viewerType == "learner") {
          this.learnerResourceSubscription = this.learnerService.showLearnerResource(resourceId).subscribe(
            (res) => {
              this.resource = res['dataCon'].thisLearnerStudyResource;
              this.resourcePrivacy = this.resource['isPublic'];
              this.resourceContent = JSON.parse(JSON.parse(this.resource['resource_body']));
              this.resourceOwnerId = this.resource['tutor_id'];
              this.parseResourceContentType(this.resourceContent);
              // change image path
              this.resourceImage = this.imgBaseUrl + this.resource['resource_image'];
            },
            (err) => { console.log(err) }
          );
        }
        // change image path
        this.resourcePageSubscription = this.resourceCtrlService.resourcePageProperty.subscribe(
          msg => {
            this.resourcePage = msg['resourcePage'];
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    // console.log("<<ShowResourceComponent>> [ngOnDestroy]");
    if(this.viewerType == "tutor") {
      this.tutorResourceSubscription.unsubscribe();
    } else if(this.viewerType == "learner") {
      this.learnerResourceSubscription.unsubscribe();
    }
    this.resourcePageSubscription.unsubscribe();
  }

  // define viewer type (tutor or learner)
  defineViewerType() {
    if (this.localStorage.getItem('lsaWho') == '3') {
      this.viewerType = "tutor";
    } else if (this.localStorage.getItem('lsaWho') == '1' || this.localStorage.getItem('lsaWho') == '2') {
      this.viewerType = "learner";
    }
  }

  // define resource owner
  defineResourceOwner() {
    if (this.localStorage.getItem('lsaUserId') == this.resourceOwnerId) {
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }
  }

  // parse resource data
  parseResourceContentType(resourceContent: object) {
    if (resourceContent.hasOwnProperty('questionType')) {
      this.resourceType = "homework";
      let displayMode;
      if (this.viewerType == "tutor") {
        displayMode = "overview";
      } else if (this.viewerType == "learner") {
        displayMode = "display";
      }
      this.resourceCtrlService.sendAccessProperty(this.viewerType, displayMode);
    } else {
      this.resourceType = "other";
    }
  }

  // edit resource
  editResource() {
    if (this.resourceType == "homework") {
      let resourceBrief = {};
      resourceBrief['resource_subject'] = this.resource['resource_subject'];
      resourceBrief['resource_grade'] = this.resource['resource_grade'];
      resourceBrief['studyResource_id'] = this.resource['studyResource_id'];
      resourceBrief['resource_title'] = this.resource['resource_title'];
      resourceBrief['resource_des'] = this.resource['resource_des'];
      resourceBrief['resource_image'] = this.resource['resource_image'];
      resourceBrief['resource_tags'] = this.resource['resource_tags'];
      resourceBrief['isPublic'] = this.resource['isPublic'];

      // prepare homework resource content
      let resourceObj = new ResourceDetails(
        this.resourceType,
        resourceBrief,
        this.resourceContent);
      this.resourceCtrlService.sendResourceInfo(resourceObj, "edit");

      // navigate to homework resource edit page
      this.router.navigate(['/app/dashboard/tutor/resources/edit']);
    }
  }

  // go back to resource page
  goBack() {
    if (this.resourcePage == undefined) {
      this.resourcePage = 1;
    }
    if (this.viewerType == "tutor") {
      this.router.navigate(['/app/dashboard/tutor/resources/view'], { queryParams: { page: this.resourcePage } });
    } else if (this.viewerType == "learner") {
      this.router.navigate(['/app/dashboard/learner/homework/view'], { queryParams: { page: this.resourcePage } });
    }
  }

  // assign resources to learners
  assignResources() {
    // console.log("Assign this resource to learners....");
  }

  // prepare author image
  prepareAuthorImage(authorId: string) {
    // let a = 1526863850931;
    return this.authorImage + authorId + '-cp.jpeg';
  }

}
