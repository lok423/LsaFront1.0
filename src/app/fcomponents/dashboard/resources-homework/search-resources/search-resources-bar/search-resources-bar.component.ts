import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ResourceRepositoryService } from '../../../../../services/repositories/resource-repository.service';

@Component({
  selector: 'app-search-resources-bar',
  templateUrl: './search-resources-bar.component.html',
  styleUrls: ['./search-resources-bar.component.css']
})
export class SearchResourcesBarComponent implements OnInit, OnDestroy {

  seachOptionPropertySubscription: Subscription;

  @Input() barOwner: string;
  @Output() returnSelectedSearchCondition: EventEmitter<any> = new EventEmitter<any>();
  @Output() returnLearnerSearchCondition: EventEmitter<any> = new EventEmitter<any>();

  searchOptions: any[];
  filterOptions: any[] = [];

  // own or public
  isPublic: string = "1";
  // resource finish status (all, isFinished, unFinished)
  resourceFinishStatus: string = "";
  // resource subject
  resourceSubject: string = "";
  // resource grades
  resourceGrade: string = "";
  // resource types
  resourceType: string = "";
  // resource date
  resourceDate: string = "";
  // resource public or private visibility (private, public)
  resourceVisibility: string = "";
  // resource tags search
  resourceTagsInfo: string;

  // subject array
  subjectArray: any[];
  // grade array
  gradeArray: any[];

  // default search option
  defaultSearchOption: any[];

  constructor(
    private resourceCtrlService: ResourceRepositoryService
  ) { }

  ngOnInit() {
    this.seachOptionPropertySubscription = this.resourceCtrlService.seachOptionProperty.subscribe(
      msg => {
        if (msg.hasOwnProperty('data')) {
          this.searchOptions = msg['data'];
          this.populateSearchArray();
        }
      }
    );
  }

  ngOnDestroy(): void {
    console.log("<<SearchResourcesBarComponent>> [ngOnDestroy]");
    this.seachOptionPropertySubscription.unsubscribe();
  }

  // populate array for search bar display
  populateSearchArray() {
    for (let i of this.searchOptions) {
      if (i['name'] == "subject") {
        this.subjectArray = i['data'];
      } else if (i['name'] == "grade") {
        this.gradeArray = i['data'];
      }
    }
  }

  getLearnerResourceType() {
    let a = document.getElementById('resOrHomework')['value'];
    this.returnLearnerSearchCondition.emit(Number(a));
  }

  // get selected privacy
  getSelectedPrivacy() {
    // console.log(document.getElementById('public-own')['value']);
    this.isPublic = document.getElementById('public-own')['value'];
    let filterObj: object;
    if (this.isPublic == "all") {
      filterObj = { name: "isPublic", value: this.isPublic };
    } else {
      filterObj = { name: "isPublic", value: Number(this.isPublic) };
    }
    this.prepareFilterOptions(filterObj);
  }

  // get selected subject
  getSelectedSubject() {
    // console.log(document.getElementById('subject')['value']);
    this.resourceSubject = document.getElementById('subject')['value'];
    // this.prepareSelectOptions(this.barOwner);
    let filterObj = { name: "resource_subject", value: this.resourceSubject };
    this.prepareFilterOptions(filterObj);
  }

  // get selected grade
  getSelectedGrade() {
    // console.log(document.getElementById('grade')['value']);
    this.resourceGrade = document.getElementById('grade')['value'];
    // this.prepareSelectOptions(this.barOwner);
    let filterObj = { name: "resource_grade", value: this.resourceGrade };
    this.prepareFilterOptions(filterObj);
  }

  // prepare filter options
  prepareFilterOptions(filterObj: object) {
    let filterNameList: any[] = [];
    if (this.filterOptions.length != 0) {
      for (let a of this.filterOptions) {
        filterNameList.push(a['name']);
      }
      let index = filterNameList.indexOf(filterObj['name']);
      if (index < 0) {
        this.filterOptions.push(filterObj);
      } else {
        this.filterOptions[index] = filterObj;
      }
    } else {
      this.filterOptions.push(filterObj);
    }
    this.returnSelectedSearchCondition.emit(this.filterOptions);
  }

  // **************** Tutor Filter ****************
  // arrange own public value


  // filter resources by own or public
  filterByOwnPublic() {
    if (this.isPublic) { // get all public resources
      console.log("Get all public resources from community....");
    } else { // get all personal resources
      console.log("Get all personal resources for tutor....");
    }
  }

  // **************** Learner Filter ****************
  // filter resources by finish status
  filterByFinshStatus(resStatus: string) {
    if (resStatus == "all") {
      console.log("Return all resources...");
    } else if (resStatus == "isFinished") {
      console.log("Return all finished resources.....");
    } else if (resStatus == "unFinished") {
      console.log("Return all unfinished resources.....");
    }
  }

  // **************** Public Filter ****************
  // filter resource by subject
  filterBySubject(resSubject: string) {
    console.log("Filter by subject: " + resSubject);
  }

  // filter tutor resource by resource public or private
  filterByPublicPrivate() {
    console.log(this.resourceVisibility);
  }

}
