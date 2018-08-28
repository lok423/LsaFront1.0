import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ResourceRepositoryService } from '../../../../../../../services/repositories/resource-repository.service';
import { QuestionUtility } from '../question-utility';

@Component({
  selector: 'app-short-answers-parent',
  templateUrl: './short-answers-parent.component.html',
  styleUrls: ['./short-answers-parent.component.css']
})
export class ShortAnswersParentComponent implements OnInit, OnDestroy {

  accessPropertySubscription: Subscription;
  signalPropertySubscription: Subscription;
  questionArraySubscription: Subscription;
  // all question data for show
  @Input() questionData: any;

  // viewer type (tutor or learner)
  viewerType: string;
  // access type (modify or display)
  accessType: string;

  // array to store all questions
  questionArray: any[] = [];

  questionCtrl: QuestionUtility;
  // total number of allowed questions
  questionAllowedNum: number = 20;

  constructor(
    private resourceCtrlService: ResourceRepositoryService,
  ) { }

  ngOnInit() {
    if (this.questionData != undefined) {
      console.log("<<ShortAnswers Parent>> receives question collection:");
      console.log(this.questionData);
      this.questionArray = this.questionData;
    }

    // get access properties
    this.accessPropertySubscription = this.resourceCtrlService.accessProperty.subscribe(
      msg => {
        if (Object.keys(msg).length != 0) {
          console.log("<<ShortAnswers Parent>> receives access message:");
          console.log(msg);
          this.viewerType = msg['viewerType'];
          this.accessType = msg['op'];
          console.log("ViewerType is: " + this.viewerType);
          console.log("AccessType is: " + this.accessType);
        }
      }
    );

    // get signal to send quesitons back
    this.signalPropertySubscription = this.resourceCtrlService.signalProperty.subscribe(
      msg => {
        if (Object.keys(msg).length != 0) {
          console.log("<<ShortAnswers Parent>> receives signal message:");
          console.log(msg);
          if (msg['op'] == "request2Save") {
            console.log("<<ShortAnswers Parent>> receives signal to send back question array");
            this.resourceCtrlService.sendSavedQuestionArray("short", this.questionArray);
          }
        }
      }
    );

    // take actions on question array for different purposes
    this.questionArraySubscription = this.resourceCtrlService.questionArray.subscribe(
      msg => {
        if (Object.keys(msg).length != 0) {
          console.log("<<ShortAnswers Parent>> receives questionArray message:");
          console.log(msg);
          let op = msg['op'];
          if (op == "init" && this.accessType == "modify") {
            console.log("<<ShortAnswers Parent>> receives `init` operation command....");
            this.questionArray = msg['value'];
          } else if (op == "edit") {
            console.log("<<ShortAnswers Parent>> receives `edit` operation command....");
            console.log(msg['value']);
            this.questionArray = msg['value'];
          } else if (op == "save") {
            console.log("<<ShortAnswers Parent>> receives `save` operation command.... (useless)");
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    console.log("<<ShortAnswersParentComponent>> [ngOnDestroy]");
    this.resourceCtrlService.clearQuestionSourceSubject();
    this.questionArraySubscription.unsubscribe();
    this.signalPropertySubscription.unsubscribe();
    this.accessPropertySubscription.unsubscribe();
  }

  // get prepared question object
  getQuestionObj(type: string, id: number, content: object) {
    this.questionCtrl = new QuestionUtility();
    return this.questionCtrl.prepareQuestionInfo(type, id, content);
  }

  // add question
  addQuestion() {
    if (this.questionArray.length === 0) {
      console.log("Please finish the uncompleted questions!!!!");
    } else {
      if (this.questionArray.length < this.questionAllowedNum) {
        if (this.questionArray[this.questionArray.length - 1].questionSaveStatus == "init") {
          alert("Please complete uncompleted question!!!");
        } else {
          let newQuizObj = this.getQuestionObj("short", this.questionArray.length + 1, {});
          newQuizObj.questionSaveStatus = "init";
          this.questionCtrl = new QuestionUtility();
          this.questionCtrl.addQuestion(this.questionArray, newQuizObj);
        }
      } else {
        alert("Can't add more questions...");
      }
    }
  }

  // handle question save
  handleSaveQuestion(questionObj) {
    if (questionObj.type == "new") {
      // remove pre insert question content
      this.questionArray.splice(-1, 1);
      // push question content to question array
      this.questionCtrl = new QuestionUtility();
      this.questionCtrl.addQuestion(this.questionArray, questionObj.quizContent);
    } else if (questionObj.type == "existed") {
      this.questionArray[questionObj.quizContent.questionId - 1] = questionObj.quizContent;
    }
  }

  // handle question edit
  handleEditQuestion(questionId: number) {
    // change question save status
    this.questionCtrl = new QuestionUtility();
    this.questionCtrl.changeQuestionStatus(this.questionArray, questionId, "unSaved");
  }

  // handle question delete
  handleDeleteQuestion(questionId: number) {
    this.questionCtrl = new QuestionUtility();
    this.questionCtrl.deleteQuestion(this.questionArray, questionId);
  }

  // handle question discard
  handleDiscardQuestion(questionId: number) {
    this.handleDeleteQuestion(questionId);
  }

  // handle question change position
  handleQuestionChangePosUp(questionId: number) {
    this.questionCtrl = new QuestionUtility();
    this.questionCtrl.questionUp(this.questionArray, questionId);
  }

  // handle question change position
  handleQuestionChangePosDown(questionId: number) {
    this.questionCtrl = new QuestionUtility();
    this.questionCtrl.questionDown(this.questionArray, questionId);
  }

  // display or show add question button
  displayAddQuizBtn() {
    this.questionCtrl = new QuestionUtility();
    return this.questionCtrl.hideOrDisplayAddBtn(this.questionArray);
  }
}
