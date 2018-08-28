import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Component, OnInit, Pipe , Inject} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { TutorService } from './../../../../../services/servercalls/tutor.service';
import { LearnerService } from './../../../../../services/servercalls/learner.service';
import { ResourceRepositoryService } from '../../../../../services/repositories/resource-repository.service';
import { tutorSearchProps, learnerSearchProps } from './search-properties';
import { HomeworkLevel } from '../../tutor-edit-resource/edit-resource-panel/tutor-homework/homework-prebuiltData';

import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-search-resource',
  templateUrl: './search-resources-panel.component.html',
  styleUrls: ['./search-resources-panel.component.css']
})
export class SearchResourcesPanelComponent implements OnInit {
  // sarch property
  searchProperty: any[];
  // returned resources
  resources: any;
  // total number of page
  totalPage: number;
  // total number of resource items
  totalResNum: number;
  // array for each page index
  pageArray: number[] = [];
  // array for head display buttons
  headBtnArray: number[] = [];
  // array for tail display buttons
  tailBtnArray: number[] = [];
  // current view index
  currentViewIndex: number = 1;
  // number of resources can be viewed in one page
  pageSize: number = 9;
  // number of page buttons to display
  indexBtnLimit = 5;
  // button highlight array
  highlightArray: boolean[] = [];
  // MatPaginator Output
  pageEvent: PageEvent;
  // current resource view
  currentViewResource: any[] = [];
  // all resources
  allResourcesCollection: object[] = [];
  // filtered resources
  filteredResourceCollection: object[] = [];
  // filter status
  isFilter: boolean = false;
  // ***** viewer type ******
  viewerType: string;
  // search option array
  searchOptionArray: any[] = [];
  // search options
  searchOptions: any;
  // subject option array
  subjectArray: any[] = [];
  // grade option array
  gradeArray: any[] = [];
  // type option array
  typeArray: any[] = [];

  imgBaseUrl: string = environment.baseImgUrl + "/resources/imgs/";
  // resourceImage: string;
  authorImage: string = environment.baseUserImgUrl;

  // base router link for each resource card
  resourceCardRouterLink: string;
  display: Window;
  

  constructor(
    @Inject(WINDOW) 
    private window: Window, 
    @Inject(LOCAL_STORAGE) 
    private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private learnerService: LearnerService,
    private resourceCtrlService: ResourceRepositoryService
  ) { 
    this.display = window
  }


  ngOnInit() {
    this.defineViewerType();
    if (this.viewerType == "tutor") {
      this.resourceCardRouterLink = "/app/dashboard/tutor/resources/view/resources";
    } else if (this.viewerType == "learner") {
      this.resourceCardRouterLink = "/app/dashboard/learner/homework/view/hw";
    }
    this.allResourcesCollection = [];
    this.filteredResourceCollection = [];
    if (this.viewerType == "tutor") {
      this.searchProperty = tutorSearchProps;
    } else if (this.viewerType == "learner") {
      this.searchProperty = learnerSearchProps;
    }
    this.route.queryParams.subscribe(
      params => {
        if (!params.hasOwnProperty("search")) {
          this.currentViewIndex = params['page'];
          this.isFilter = false;
        } else {
          this.searchOptions = JSON.parse(this.window.atob(params['search']));
          this.currentViewIndex = params['page'];
          this.isFilter = true;
        }
        this.fetchAllResources();
      }
    );
  }

  // define viewer type (tutor or learner)
  defineViewerType() {
    if (this.localStorage.getItem('lsaWho') == '3') {
      this.viewerType = "tutor";
    } else if (this.localStorage.getItem('lsaWho') == '1' || this.localStorage.getItem('lsaWho') == '2') {
      this.viewerType = "learner";
    }
  }

  // populate page index array
  populatePageIndexArray(totalPage) {
    this.pageArray = [];
    for (let i = 0; i < totalPage; i++) {
      this.pageArray.push(i + 1);
    }
  }

  // populate button highlight arrayviewerType
  populatePageHighlightArray(totalPage) {
    for (let i = 0; i < totalPage; i++) {
      if (i == 0) {
        this.highlightArray.push(true);
      } else {
        this.highlightArray.push(false);
      }
    }
  }

  // prepare page display button array
  prepareBtnDisplayArray() {
    this.headBtnArray = [];
    this.tailBtnArray = [];

    if (this.totalPage <= this.indexBtnLimit) {
      this.headBtnArray = [];
      for (let i = 1; i <= this.totalPage; i++) {
        this.headBtnArray.push(i);
      }
      this.tailBtnArray = [];
    } else {
      if (this.totalPage - this.indexBtnLimit <= 2) {
        this.headBtnArray = [];
        for (let i = 1; i <= this.totalPage; i++) {
          this.headBtnArray.push(i);
        }
        this.tailBtnArray = [];
      } else {
        if (this.currentViewIndex / this.indexBtnLimit < 1) {
          if (this.indexBtnLimit - this.currentViewIndex % this.indexBtnLimit >= 2) {
            this.headBtnArray = [];
            for (let i = 1; i <= this.indexBtnLimit; i++) {
              this.headBtnArray.push(i);
            }
            this.tailBtnArray = [];
          } else {
            this.headBtnArray = [];
            for (let i = 1; i <= this.indexBtnLimit + 1; i++) {
              this.headBtnArray.push(i);
            }
            this.tailBtnArray = [];
          }
        } else if (this.currentViewIndex / this.indexBtnLimit == 1) {
          this.headBtnArray = [];
          for (let i = 1; i <= this.indexBtnLimit + 2; i++) {
            this.headBtnArray.push(i);
          }
          this.tailBtnArray = [];
        } else {
          this.headBtnArray = [1, 2];
          this.tailBtnArray = [];
          let startBtn = this.currentViewIndex - 2;
          let endBtn = this.currentViewIndex + 2;
          if (endBtn > this.pageArray.length) {
            this.tailBtnArray = this.pageArray.slice(
              this.pageArray.length - this.indexBtnLimit, this.pageArray.length);
          } else {
            this.tailBtnArray = this.pageArray.slice(startBtn - 1, endBtn);
          }
        }
      }
    }
  }

  // update page button highlight array
  updatePageHighlightArray(index) {
    let a = this.highlightArray.indexOf(true);
    this.highlightArray[a] = false;
    this.highlightArray[index - 1] = true;
  }

  // get value from page index input
  getIndexInput(eleId) {
    let inputValue = Number(document.getElementById(eleId)['value']);
    if (isNaN(inputValue)) {
      console.log("Please type number!!!");
    } else {
      if (inputValue === 0 || inputValue === 1) {
        this.currentViewIndex = 1;
      } else {
        if (inputValue * this.pageSize - this.totalResNum < this.pageSize) {
          this.currentViewIndex = inputValue;
        } else {
          this.currentViewIndex = this.totalResNum % this.pageSize + 1;
        }
      }
      this.goPage(this.currentViewIndex);
    }
  }

  // go to clicked page
  goPage(index) {
    if (!this.isFilter) {
      if (this.viewerType == "tutor") {
        this.router.navigate(['/app/dashboard/tutor/resources/view'], { queryParams: { page: index } });
      } else if (this.viewerType == "learner") {
        this.router.navigate(['/app/dashboard/learner/homework/view'], { queryParams: { page: index } });
      }
    } else {
      if (this.viewerType == "tutor") {
        this.router.navigate(
          ['/app/dashboard/tutor/resources/view'],
          {
            queryParams: {
              page: index,
              search: this.window.btoa(JSON.stringify(this.searchOptions))
            }
          });
      } else if (this.viewerType == "learner") {
        this.router.navigate(
          ['/app/dashboard/learner/homework/view'],
          {
            queryParams: {
              page: index,
              search: this.window.btoa(JSON.stringify(this.searchOptions))
            }
          });
      }
    }
  }

  // fetch resources from all pages
  // call this function
  fetchAllResources() {
    if (this.viewerType == "tutor") {
      this.tutorService.indexTutorResources().subscribe(
        res => {
          this.allResourcesCollection = res['dataCon']['tutorStudyResources'];
          if (!this.isFilter) {
            this.totalResNum = this.allResourcesCollection.length;
            if (this.totalResNum % this.pageSize == 0) {
              this.totalPage = this.totalResNum / this.pageSize;
            } else {
              this.totalPage = Math.floor(this.totalResNum / this.pageSize + 1);
            }
            if (this.currentViewIndex == 1) {
              this.prepareDefaultResources();
            } else {
              this.fetchIndexResources(this.currentViewIndex);
            }
          } else {
            // filter resources and prepare resource view
            this.filterResources(this.searchOptions);
          }
          this.populateMatchCondition();
        }
      );
    } else if (this.viewerType == "learner") {
      this.learnerService.indexLearnerResources().subscribe(
        res => {
          this.allResourcesCollection = res['dataCon']['learnerHomework'];
          if (!this.isFilter) {
            this.totalResNum = this.allResourcesCollection.length;
            if (this.totalResNum % this.pageSize == 0) {
              this.totalPage = this.totalResNum / this.pageSize;
            } else {
              this.totalPage = Math.floor(this.totalResNum / this.pageSize + 1);
            }
            if (this.currentViewIndex == 1) {
              this.prepareDefaultResources();
            } else {
              this.fetchIndexResources(this.currentViewIndex);
            }
          } else {
            // filter resources and prepare resource view
            this.filterResources(this.searchOptions);
          }
          this.populateMatchCondition();
        }
      );
    }
  }

  // get learner homework or public resources
  getLearnerPublicOrHomework(resType: number) {
    if (resType == 1) {
      this.learnerService.indexLearnerResources().subscribe(
        res => {
          this.allResourcesCollection = res['dataCon']['learnerHomework'];
          if (!this.isFilter) {
            this.totalResNum = this.allResourcesCollection.length;
            if (this.totalResNum % this.pageSize == 0) {
              this.totalPage = this.totalResNum / this.pageSize;
            } else {
              this.totalPage = Math.floor(this.totalResNum / this.pageSize + 1);
            }
            if (this.currentViewIndex == 1) {
              this.prepareDefaultResources();
            } else {
              this.fetchIndexResources(this.currentViewIndex);
            }
          } else {
            // filter resources and prepare resource view
            this.filterResources(this.searchOptions);
          }
          this.populateMatchCondition();
        }
      );
    }
    if (resType == 2) {
      this.learnerService.indexLearnerPublicResources().subscribe(
        res => {
          this.allResourcesCollection = res['dataCon']['learnerHomework'];
          if (!this.isFilter) {
            this.totalResNum = this.allResourcesCollection.length;
            if (this.totalResNum % this.pageSize == 0) {
              this.totalPage = this.totalResNum / this.pageSize;
            } else {
              this.totalPage = Math.floor(this.totalResNum / this.pageSize + 1);
            }
            if (this.currentViewIndex == 1) {
              this.prepareDefaultResources();
            } else {
              this.fetchIndexResources(this.currentViewIndex);
            }
          } else {
            // filter resources and prepare resource view
            this.filterResources(this.searchOptions);
          }
          this.populateMatchCondition();
        }
      );
    }
  }

  // fetch resources according to page index
  fetchIndexResources(index) {
    if (!this.isFilter) {
      this.prepareViewResource(index, this.allResourcesCollection);
    } else {
      this.prepareViewResource(index, this.filteredResourceCollection);
    }
  }

  // get page size from MatPaginator
  changed(event: PageEvent) {
    this.currentViewIndex = event.pageIndex + 1;
    this.goPage(this.currentViewIndex);
  }

  // go to previous page
  goPrevious() {
    if (this.currentViewIndex > 1) {
      this.currentViewIndex--;
      this.prepareBtnDisplayArray();
      this.goPage(this.currentViewIndex);
    }
  }

  // go to next page
  goNext() {
    if (this.currentViewIndex < this.totalPage) {
      this.currentViewIndex++;
      this.prepareBtnDisplayArray();
      this.goPage(this.currentViewIndex);
    }
  }

  // clear selection
  clearSelectionData() {
    this.typeArray = [];
    this.subjectArray = [];
    this.gradeArray = [];
  }

  // process data from api return result, and populate search condition array
  populateMatchCondition() {
    this.clearSelectionData();
    for (let res of this.allResourcesCollection) {
      for (let i of this.searchProperty) {
        if (this.viewerType == "tutor") {
          if (i['name'] == "resource_type") {
            if (this.typeArray.indexOf(res['resource_type']) < 0) {
              this.typeArray.push(res['resource_type']);
            }
          } else if (i['name'] == "resource_subject") {
            if (this.subjectArray.indexOf(res['resource_subject']) < 0) {
              this.subjectArray.push(res['resource_subject']);
            }
          } else if (i['name'] == "resource_grade") {
            if (this.gradeArray.indexOf(res['resource_grade']) < 0) {
              this.gradeArray.push(res['resource_grade']);
            }
          }
          let hwLevel: any[] = HomeworkLevel;
          this.gradeArray = this.sortOptions(this.gradeArray, hwLevel, "name");

          this.collectSearchOptions({ name: "type", data: this.typeArray });
          this.collectSearchOptions({ name: "subject", data: this.subjectArray });
          this.collectSearchOptions({ name: "grade", data: this.gradeArray });
        } else if (this.viewerType == "learner") {
          if (i['name'] == "resource_type") {
            if (this.typeArray.indexOf(res['resource_type']) < 0) {
              this.typeArray.push(res['resource_type']);
            }
          } else if (i['name'] == "resource_subject") {
            if (this.subjectArray.indexOf(res['resource_subject']) < 0) {
              this.subjectArray.push(res['resource_subject']);
            }
          } else if (i['name'] == "resource_grade") {
            if (this.gradeArray.indexOf(res['resource_grade']) < 0) {
              this.gradeArray.push(res['resource_grade']);
            }
          }
          let hwLevel: any[] = HomeworkLevel;
          this.gradeArray = this.sortOptions(this.gradeArray, hwLevel, "name");

          this.collectSearchOptions({ name: "type", data: this.typeArray });
          this.collectSearchOptions({ name: "subject", data: this.subjectArray });
          this.collectSearchOptions({ name: "grade", data: this.gradeArray });
        }
      }
      this.resourceCtrlService.sendSearchOption(this.viewerType, this.searchOptionArray);
    }
  }

  // sort option by predefined id
  sortOptions(data: any[], sequenceArray: any[], target: any) {
    let newArray = [];
    for (let i of sequenceArray) {
      for (let j of data) {
        if (i[target] == j) {
          newArray.push(j);
        }
      }
    }
    return newArray;
  }

  // organize search option array for search bar
  collectSearchOptions(optionArray: object) {
    this.searchOptionArray.push(optionArray);
  }

  // prepare resource according to page or other conditions
  prepareViewResource(viewIndex: number, resourceCollection: any[]) {
    this.currentViewResource = [];
    if (resourceCollection.length <= this.pageSize) {
      this.currentViewResource = resourceCollection;
    } else {
      let viewLimitNum = viewIndex * this.pageSize;
      let viewStart = viewLimitNum - this.pageSize;
      for (let i = viewStart, j = 1; i < resourceCollection.length && j <= this.pageSize; i++ , j++) {
        this.currentViewResource.push(resourceCollection[i]);
      }
    }

    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(this.currentViewResource);

    this.populatePageIndexArray(this.totalPage);
    this.populatePageHighlightArray(this.totalPage);
    this.updatePageHighlightArray(viewIndex);
    this.prepareBtnDisplayArray();
    this.currentViewIndex = viewIndex;
    this.window.scroll(0, 0);
  }

  // handle search options from search bar
  handleSearchOption(filterOption: any[]) {
    let optionLength = filterOption.length;
    let isAll = 0;
    for (let i of filterOption) {
      if (i['value'] == "all") {
        isAll++;
      }
    }
    if (this.viewerType == "tutor") {
      if (optionLength == isAll) {
        this.router.navigate(['/app/dashboard/tutor/resources/view'], { queryParams: { page: 1 } });
      } else {
        this.router.navigate(
          ['/app/dashboard/tutor/resources/view'],
          {
            queryParams: {
              page: 1,
              search: this.window.btoa(JSON.stringify(filterOption))
            }
          });
      }
    } else if (this.viewerType == "learner") {
      if (optionLength == isAll) {
        this.router.navigate(['/app/dashboard/learner/homework/view'], { queryParams: { page: 1 } });
      } else {
        this.router.navigate(
          ['/app/dashboard/learner/homework/view'],
          {
            queryParams: {
              page: 1,
              search: this.window.btoa(JSON.stringify(filterOption))
            }
          });
      }
    }
    // this.filterResources(filterOption);
  }

  // filter resources according to returned search options
  filterResources(searchOption: any[]) {
    this.filteredResourceCollection = [];
    for (let res of this.allResourcesCollection) {
      let expectedMatch = searchOption.length;
      let match = 0;
      for (let i of searchOption) {
        let filterName = i['name'];
        if (res.hasOwnProperty(filterName)) {
          if ((res[filterName] == i['value']) || (i['value'] == "all")) {
            match++;
          }
        }
      }
      if (match == expectedMatch) {
        this.filteredResourceCollection.push(res);
      }
    }
    this.isFilter = true;
    if (this.currentViewIndex == 1) {
      this.prepareDefaultResources();
    } else {
      this.prepareViewResource(this.currentViewIndex, this.filteredResourceCollection);
    }
  }

  // prepare default display resourcse
  prepareDefaultResources() {
    if (!this.isFilter) {
      this.prepareViewResource(1, this.allResourcesCollection);
    } else {
      this.totalResNum = 0;
      this.totalResNum = this.filteredResourceCollection.length;
      if (this.totalResNum % this.pageSize == 0) {
        this.totalPage = this.totalResNum / this.pageSize;
      } else {
        this.totalPage = Math.floor(this.totalResNum / this.pageSize + 1);
      }
      this.prepareViewResource(1, this.filteredResourceCollection);
    }
  }

  // send page number information to selected resource
  sendPageNumberToSelected() {
    this.resourceCtrlService.sendResourcePage(this.currentViewIndex);
  }

  // prepare resource image
  prepareResourceImage(imgUrl: string) {
    return this.imgBaseUrl + imgUrl;
  }

  // prepare author image
  prepareAuthorImage(authorId: string) {
    // let a = 1526863850931;
    return this.authorImage + authorId + '-cp.jpeg';
    // return this.imgBaseUrl + imgUrl;
  }
}
