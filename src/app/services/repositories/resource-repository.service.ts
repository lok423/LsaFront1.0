import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceRepositoryService {

  constructor() { }

  private accessSubject = new BehaviorSubject({});
  accessProperty = this.accessSubject.asObservable();

  private signalSubject = new BehaviorSubject({});
  signalProperty = this.signalSubject.asObservable();

  private resourceSubject = new BehaviorSubject({});
  resourceProperty = this.resourceSubject.asObservable();

  private homeworkSubject = new BehaviorSubject({});
  homeworkProperty = this.resourceSubject.asObservable();

  // controlling question content collection
  private questionSource = new BehaviorSubject({});
  questionArray = this.questionSource.asObservable();

  private searchOptionObject = new BehaviorSubject({});
  seachOptionProperty = this.searchOptionObject.asObservable();

  // send page information for resources
  private resourcePageObject = new BehaviorSubject({});
  resourcePageProperty = this.resourcePageObject.asObservable();

  // ***************************************************
  // ************ Resources Related Services ************
  // ***************************************************
  // send access property (tutor or learner, display or modify)
  sendAccessProperty(user: string, op: string) {
    console.log("Sending access property....");
    let accessObj = { viewerType: user, op: op };
    this.accessSubject.next(accessObj);
  }

  // requesting questionArray to save from question parent
  requestQuestionArayToSave() {
    console.log("Requesting question array from question parent....");
    let signalObj = { op: "request2Save" };
    this.signalSubject.next(signalObj);
  }

  // send resource information for any usage purposes
  sendResourceInfo(resource: object, op: string) {
    console.log("Sending resource object....");
    let resourceObj = { op: op, value: resource };
    this.resourceSubject.next(resourceObj);
  }

  // send homework information for any usage purposes
  sendHomeworkInfo(resource: object, op: string) {
    console.log("Sending homework object....");
    let homeworkObj = { op: op, value: resource };
    this.homeworkSubject.next(homeworkObj);
  }

  // ***************************************************
  // ************ Question Related Services ************
  // ***************************************************
  // send empty question array for creating questions for new homework
  initQuestionArray() {
    console.log("Sending initialized empty question array....");
    let emptyArray: any[] = [];
    let msg = { op: "init", value: emptyArray };
    this.questionSource.next(msg);
  }

  // send question array collection
  sendSavedQuestionArray(quizType, quizArray: any[]) {
    console.log("Sending question array.....");
    let questionInfo = {
      questionType: '',
      questionCollection: []
    };
    questionInfo.questionType = quizType;
    questionInfo.questionCollection = quizArray;
    let msg = { op: "save", value: questionInfo };
    this.questionSource.next(msg);
  }

  // send question collection for edit
  sendQuestionForEdit(quizInfo: object) {
    console.log("Sending question information for editing...");
    let msg = { op: "forEdit", value: quizInfo };
    this.questionSource.next(msg);
  }

  // send ready to go question
  sendReadyToGoQuestionCollection(quizInfo: any[]) {
    console.log("Sending ready to go questions for editing....");
    let msg = { op: "edit", value: quizInfo };
    this.questionSource.next(msg);
  }

  // ***************************************************
  // ************ Search Related Services ************
  // ***************************************************
  sendSearchOption(user: string, data: any) {
    console.log("Sending search option....");
    let searchOpt = { viewerType: user, data: data };
    this.searchOptionObject.next(searchOpt);
  }

  // ***************************************************
  // ************ Show Related Services ************
  // ***************************************************
  sendResourcePage(pageNum: number) {
    console.log("Sending resource page information...");
    let resPageObj = { resourcePage: pageNum };
    console.log(resPageObj);
    this.resourcePageObject.next(resPageObj);
  }


  // ************* clear subscription ******************
  // clear access property subject subscription
  clearAccessSubject() {
    console.log("Clear access subject....");
    this.accessSubject.next({});
  }

  // clear access property subscription
  clearSignalSubject() {
    console.log("Clear signal subject....");
    this.signalSubject.next({});
  }

  // clear resource subject subscription
  clearResourceSubject() {
    console.log("Clear resource subject....");
    this.resourceSubject.next({});
  }

  // clear homework subject subscription
  clearHomeworkSubject() {
    console.log("Clear homework subject....");
    this.homeworkSubject.next({});
  }

  // clear question source subject subscription
  clearQuestionSourceSubject() {
    console.log("Clear question source subject....");
    this.questionSource.next({});
  }

  // clear search option subject subscription
  clearSearchOptionSubject() {
    console.log("Clear search option subject....");
    this.searchOptionObject.next({});
  }

  // clear search option subject subscription
  clearResourcePageSubject() {
    console.log("Clear search option subject....");
    this.resourcePageObject.next({});
  }
}
