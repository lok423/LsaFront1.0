import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ImageEditorDialogComponent } from '../../../../../support/image-editor-dialog/image-editor-dialog.component';
import { Router } from '@angular/router';

import {
  HomeworkInfo,
  HomeworkBasicInfo,
  QuestionInfo
} from '../../../../../../models/HomeworkResourceModel';

import {
  Privacy,
  HomeworkLevel,
  HomeworkCategory,
  HomeworkSubject
} from './homework-prebuiltData';

import { TutorService } from './../../../../../../services/servercalls/tutor.service';
import { ResourceRepositoryService } from '../../../../../../services/repositories/resource-repository.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.prod';


@Component({
  selector: 'app-tutor-homework',
  templateUrl: './tutor-homework.component.html',
  styleUrls: ['./tutor-homework.component.css'],
  providers: [TutorService]
})
export class TutorHomeworkComponent implements OnInit, OnDestroy, AfterViewInit {

  imgBaseUrl: string = environment.baseImgUrl + "/resources/imgs/";
  img4Edit: string;

  questionArraySubscription: Subscription;
  homeworkDataSubscription: Subscription;

  // stepper linear
  stepperLinear: boolean = true;

  isLinear: boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // stepper 1 validation status
  // stepperOneValid: boolean = false;
  stepperOneValid: boolean = false;
  stepperTwoValid: boolean = false;

  dialogRef: MatDialogRef<ImageEditorDialogComponent>;

  // homework subject data
  hwSubjectData = HomeworkSubject;
  // homework category data
  hwCategoryData = HomeworkCategory;
  // homework level
  hwDifficultyLevel = HomeworkLevel;
  // resources privacy
  hwPrivacy = Privacy;
  // homework basic information
  homeworkBasicInfo: HomeworkBasicInfo;
  // homework questtion information
  homeworkQuizInfo: QuestionInfo;
  // homework image is uploaded
  homeworkHasImage: boolean = false;
  // homework image
  homeworkImg: string;
  // server returned data
  returnedResult: object;
  // edit status
  isEdit: boolean = false;
  // data need to be edited
  editData: object;

  tutorHomeWorkForm: FormGroup;
  // form validate status
  formStatus: string = "init";
  // "next" button of homework form is clicked
  nextIsClicked: boolean = false;
  stepOneListener: any;
  display: Window;
  

  constructor(
    @Inject(WINDOW) 
    private window: Window, 
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private tutorService: TutorService,
    private resourceCtrlService: ResourceRepositoryService,
  ) {
    this.display = window
  }

  ngOnInit() {
    // receive saved questions from question parent
    this.questionArraySubscription = this.resourceCtrlService.questionArray.subscribe(
      msg => {
        if (Object.keys(msg).length != 0) {
          console.log(msg['value']);
          if (msg['op'] == "save") {
            console.log("<<TutorHomework>> received saved questions from question parent....");
            console.log("RReceived question is: ");
            console.log(msg['value']);
            this.homeworkQuizInfo = msg['value'];
          }
        }
      }
    );

    this.homeworkDataSubscription = this.resourceCtrlService.homeworkProperty.subscribe(
      msg => {
        if (Object.keys(msg).length != 0) {
          console.log("<<TutorHomework>> received homework information....");
          if (msg['op'] == "edit") {
            console.log("op is: edit");
            let homeworkInfo = msg['value'];
            this.editData = homeworkInfo;
            this.isEdit = true;
            this.resourceCtrlService.sendQuestionForEdit(homeworkInfo['resource_body']);
          }
        }
      }
    );

    this.createForm();
    this.stepOneListenerFun();
    if(this.isEdit) {
      this.stepperTwoValid = true;
    }
    // this.stepperHelperFunc();

    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    console.log("After view init.....");
    if(this.isEdit) {
      document.getElementById("collect-quiz-btn")['disabled'] = false;
    }
    this.stepperHelperFunc();

    // let list = document.getElementsByTagName("mat-step-header");
    // console.log(list[0].getAttribute("ng-reflect-index"));
    //
  }

  ngOnDestroy(): void {
    console.log("<<TutorHomeworkComponent>> [ngOnDestroy]");
    clearInterval(this.stepOneListener);
    this.resourceCtrlService.clearSignalSubject();
    this.resourceCtrlService.clearResourceSubject();
    this.questionArraySubscription.unsubscribe();
    this.homeworkDataSubscription.unsubscribe();
  }

  createForm() {
    this.tutorHomeWorkForm = this.fb.group({
      title: ['', Validators.required],
      subject: ['', Validators.required],
      grade: ['', Validators.required],
      view: ['', Validators.required],
      timeDuration: [''],
      description: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(120)])],
    });

    if (this.isEdit) {
      this.tutorHomeWorkForm.setValue({
        subject: this.editData['resource_desc'].resource_subject,
        grade: this.editData['resource_desc'].resource_grade,
        title: this.editData['resource_desc'].resource_title,
        view: this.editData['resource_desc'].isPublic,
        timeDuration: 2,
        description: this.editData['resource_desc'].resource_des,
      });
      this.homeworkBasicInfo = this.tutorHomeWorkForm.value;
      // this.stepperOneValid = true;
      this.img4Edit = this.imgBaseUrl + this.editData['resource_desc'].resource_image;
      this.homeworkHasImage = true;
    }
  }

  // load image file for homework
  loadImagePreview(imgInfo: any) {
    let output = document.getElementById('output');
    output.style.display = "block";
    output['src'] = imgInfo;
  }

  imageEditorDia() {
    let dialogRef = this.dialog.open(ImageEditorDialogComponent,
      {
        panelClass: 'dialog1',
        data: [2 / 2, this.homeworkImg],
      });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.homeworkImg = res;
          this.homeworkHasImage = true;
          this.loadImagePreview(res);
        }
      },
      (err) => console.warn(err)
    );
  }

  stepOneListenerFun() {
    this.stepOneListener = setInterval(() => {
      if (this.tutorHomeWorkForm.status == "VALID" && this.homeworkHasImage) {
        this.stepperOneValid = true;
        if (document.getElementById("next-btn") != null) {
          document.getElementById("next-btn")['disabled'] = false;
        }
      }
    }, 800);
  }

  // save homework basic information
  saveHomeworkBasicInfo() {
    this.nextIsClicked = true;
    if (this.tutorHomeWorkForm.status == "VALID") {
      this.formStatus = "valid";
      this.homeworkBasicInfo = this.tutorHomeWorkForm.value;
      // convert base64 image to blob type
      if (this.homeworkHasImage) {
        fetch(this.homeworkImg).then(
          (res) => res.blob()
        ).then(
          (blob) => {
            this.homeworkBasicInfo.img = blob;
          }
        )
      }
    } else if (this.tutorHomeWorkForm.status == "INVALID" || !this.homeworkHasImage) {
      console.log("Homework form is invalid!!!");
      this.formStatus = "invalid";
      this.nextIsClicked = false;
      document.getElementById("homework-form-div").scrollIntoView();
    }
  }

  // collect homework question information
  getHomeworkQuestion() {
    console.log("<TutorHomework> requires all questions...");
    console.log("Sending signal to question parent....");
    this.resourceCtrlService.requestQuestionArayToSave();
  }

  // collect homework information
  collectAllHomeworkInfo() {
    console.log("Collecting all homework information.....");
    console.log("Homework basic information...");
    console.log(this.homeworkBasicInfo);

    let hwInfo;
    if(this.homeworkQuizInfo == undefined) {
      hwInfo = new HomeworkInfo(this.homeworkBasicInfo, this.editData['resource_body']);
    } else {
      hwInfo = new HomeworkInfo(this.homeworkBasicInfo, this.homeworkQuizInfo);
    }

    console.warn(hwInfo);


    let homeworkFormData = new FormData();
    for (let key in hwInfo) {
      if (key == "resource_image") {
        if (hwInfo['resource_image'] != "" && hwInfo['resource_image'] != undefined) {
          if (hwInfo['resource_image']['type'] != "text/html") {
            homeworkFormData.append(key, hwInfo[key], 'test.jpeg');
          }
        }
      } else {
        homeworkFormData.append(key, hwInfo[key]);
      }
    }

    let bodyContent = homeworkFormData.get('resource_body');
    homeworkFormData.set('resource_body', JSON.stringify(bodyContent));

    if (this.isEdit) {
      console.log("Saving EDIT info!!!");
      this._updateSavedHomework(homeworkFormData);

    } else if (!this.isEdit) {
      console.log("Saving NEW info!!!");
      this._createNewHomework(homeworkFormData);
    }
  }

  // ************ Calling services START ************
  //
  // Create new homework
  // hwInfo: HomeworkInfo
  _createNewHomework(hwInfo: any) {

    console.log("Create new homework!!!!");
    console.log(hwInfo);

    this.tutorService.storeTutorResource(hwInfo).subscribe(
      (res) => {
        alert("Pop up: Homework created successful!");
        this.router.navigate(['/app/dashboard/tutor/resources/add']);
      },
      (error) => console.log(error)
    )
  }

  // Edit homework informatino
  // _method: "put"
  _updateSavedHomework(hwInfo: any) {

    // hwInfo['_method'] = "put";
    hwInfo.append('_method', "put");
    this.tutorService.updateTutorResource(
      this.editData['resource_desc'].studyResource_id, hwInfo).subscribe(
        (res) => {
          alert("Pop up: Homework updated successful!");
          this.router.navigate(['/app/dashboard/tutor/resources/view/resources'],
            { queryParams: { id: res['dataCon'].tutorStudyResource.studyResource_id } });
        },
        (error) => {
          console.log(error);
          if (Number(error['error'].code) == 422 && error['error'].error == "You need to specify a different value to update") {
            // error message: "You need to specify a different value to update"
            alert("Pop up: Homework updated successful!");
            this.router.navigate(['/app/dashboard/tutor/resources/view/resources'],
              { queryParams: { id: this.editData['resource_desc'].studyResource_id } });
          }
        }
      );
  }

  // ************ Calling services END ************

  handleQuestionSelection(questionSelected: boolean) {
    // if(!this.isEdit) {
    //
    // }
    if (questionSelected) {
      this.stepperTwoValid = true;
      if(document.getElementById("collect-quiz-btn")) {
        document.getElementById("collect-quiz-btn")['disabled'] = false;
      }

    }
  }

  handleQuestionChange(questionChange: boolean) {
    this.stepperTwoValid = false;
    if(document.getElementById("collect-quiz-btn")) {
      document.getElementById("collect-quiz-btn")['disabled'] = true;
    }
  }

  // stepper help function
  stepperHelperFunc() {
    //console.log(document.getElementById("cdk-step-label-0-1"));
    if (document.getElementById("cdk-step-label-0-1")) {
      let stepperTwo = document.getElementById("cdk-step-label-0-1");
      stepperTwo.addEventListener("click", () => {
        this.stepperTwoHelpFunc();
      });
    }

  }

  stepperTwoHelpFunc() {
    console.log("Step 2 help function....");
    if (this.stepperOneValid) {
      console.log("Step one status is valid....");
      this.saveHomeworkBasicInfo();
    }
  }
}
