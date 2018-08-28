import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { questionTypeNameMap } from '../homework-prebuiltData';
import { ResourceRepositoryService } from '../../../../../../../services/repositories/resource-repository.service';

@Component({
  selector: 'app-question-controller',
  templateUrl: './question-controller.component.html',
  styleUrls: ['./question-controller.component.css']
})
export class QuestionControllerComponent implements OnInit, OnDestroy {

  questionArraySubscription: Subscription;
  // edit mode (true or false)
  @Input() edit: boolean;

  @Output() questionTypeSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() questionTypeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  // question type
  questionType: string;
  // type name
  typeName: string;
  typeNameMap: object[] = questionTypeNameMap;
  changeType: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private resourceCtrlService: ResourceRepositoryService,
  ) { }

  ngOnInit() {
    // creating new question
    if(!this.edit) {
      console.log("<<Question Controller>> in `new` mode!");
      this.resourceCtrlService.sendAccessProperty("tutor", "modify");
      this.resourceCtrlService.initQuestionArray();
    } else {
      console.log("<<Question Controller>> in `edit` mode!");
      this.questionArraySubscription = this.resourceCtrlService.questionArray.subscribe(
        msg => {
          if(Object.keys(msg).length != 0) {
            if(msg['op'] == "forEdit") {
              let quizInfo = msg['value'];
              this.resourceCtrlService.sendAccessProperty("tutor", "modify");
              this.resourceCtrlService.sendReadyToGoQuestionCollection(quizInfo['questionCollection']);
              this.selectQuestionType(quizInfo['questionType']);
            }
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    console.log("<<QuestionControllerComponent>> [ngOnDestroy]");
    if(this.edit) {
      this.questionArraySubscription.unsubscribe();
    }
  }

  // select question type
  selectQuestionType(type: string) {
    $("#nacbarToggler").click();
    this.confirmQuestionType();
    this.questionType = type;
    for (let i of this.typeNameMap) {
      if (i['type'] == this.questionType) {
        this.typeName = i['name'];
      }
    }
    this.goSpecificType(this.questionType);
  }

  // navigate to specific type
  goSpecificType(type: string) {
    let questionLink;
    for (let a of this.typeNameMap) {
      if (a['type'] == type) {
        questionLink = a['link'];
      }
    }
    this.router.navigate([questionLink], { relativeTo: this.route });
  }

  // change question type
  changeQuestionType() {
    alert("Change question type will loose all questions!!!");
    this.changeType = true;
    this.resourceCtrlService.initQuestionArray();
    this.questionTypeChanged.emit(true);
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  confirmQuestionType() {
    this.questionTypeSelected.emit(true);
  }

}
