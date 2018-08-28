import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { QuestionObj } from '../../../../../../../../models/HomeworkResourceModel';

@Component({
  selector: 'app-short-answers',
  templateUrl: './short-answers.component.html',
  styleUrls: ['./short-answers.component.css']
})
export class ShortAnswersComponent implements OnInit {

  // viewer type
  @Input() viewerType: string;
  // access type
  @Input() accessType: string;

  // Question Id
  @Input() questionId: number;
  // question status: init, unsaved, saved
  @Input() questionStatus: string;
  // Question information
  @Input() questionInfo: QuestionObj;
  // function to create question object
  @Input() createQuizObj: Function;
  // get question value
  @Output() collectFormValue: EventEmitter<object> = new EventEmitter<object>();
  // return question id for editing
  @Output() editQuiz: EventEmitter<number> = new EventEmitter<number>();
  // return delete information
  @Output() deleteQuiz: EventEmitter<number> = new EventEmitter<number>();
  // return question id for discarding
  @Output() discardQuiz: EventEmitter<number> = new EventEmitter<number>();
  // move question position up
  @Output() upQuestion: EventEmitter<number> = new EventEmitter<number>();
  // move question position down
  @Output() downQuestion: EventEmitter<number> = new EventEmitter<number>();

  // display answer
  displayAnswer: boolean = false;

  questionForm: FormGroup;

  // create form for question
  createForm() {
    console.log("Start to create form for: " + this.viewerType);
    if (this.viewerType == "tutor") {
      if (this.questionStatus == "init") {
        // fired when a new question is added
        this.questionForm = this.fb.group({
          questionTitle: [''],
          questionText: ['', Validators.required],
          questionAnswer: ['', Validators.required]
        });
      } else if (this.questionStatus == "saved" && this.questionInfo.questionSaveStatus == "unSaved") {
        // fired when a question is required to be edited
        this.questionForm = this.fb.group({
          questionTitle: [''],
          questionText: ['', Validators.required],
          questionAnswer: ['', Validators.required]
        });
        this.questionForm.setValue({
          questionTitle: this.questionInfo.questionContent.questionTitle,
          questionText: this.questionInfo.questionContent.questionText,
          questionAnswer: this.questionInfo.questionContent.questionAnswer
        });
      }
    } else if (this.viewerType == "learner") {

      console.log("Creating form for LEARNER!!!!!");

      this.questionForm = this.fb.group({
        answer: ['']
      });
    }
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  // save question
  saveQuestion() {
    if (this.questionForm.status === "VALID") {
      let quiz = {
        type: '',
        quizContent: {}
      };

      if (this.questionStatus == "init") {
        this.questionInfo = this.createQuizObj("short", this.questionId, this.questionForm.value);
        quiz.type = "new";
      } else if (this.questionStatus == "saved") {
        if (this.questionInfo.questionSaveStatus == "unSaved") { // edit question
          this.questionInfo = this.createQuizObj(
            "short",
            this.questionInfo.questionId,
            this.questionForm.value);
          quiz.type = "existed";
        }
      }
      this.questionInfo.questionSaveStatus = 'saved';
      quiz.quizContent = this.questionInfo;

      this.collectFormValue.emit(quiz);
    } else {
      alert("New question is not saved!!");
    }
  }

  // edit question
  editQuestion() {
    let i = this.questionInfo.questionId;
    this.editQuiz.emit(i);
  }

  // delete question
  deleteQuestion() {
    this.deleteQuiz.emit(this.questionInfo.questionId);
  }

  // discard uncompleted questions
  discardQuestion() {
    if (this.questionStatus == "init") {
      if (this.questionId == 1) {
        // empty the init question form if no questions are saved
        this.questionForm.reset();
      } else {
        this.discardQuiz.emit(this.questionId);
      }
    } else if (this.questionStatus == "saved") {
      this.discardQuiz.emit(this.questionInfo.questionId);
    }
  }

  // show answer
  displayOrHideAnswer() {
    this.displayAnswer = !this.displayAnswer;
  }

  // up question
  moveQuestionUp() {
    this.upQuestion.emit(this.questionInfo.questionId);
  }

  // down question
  moveQuestionDown() {
    this.downQuestion.emit(this.questionInfo.questionId);
  }

}
