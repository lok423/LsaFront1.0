import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, ElementRef , Inject} from '@angular/core';
import { NewTutorService } from '../../../services/servercalls/new-tutor.service';
import { ApplyTeachModel } from '../../../models/ApplyTeachModel';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TutorAgreementComponent } from './../support/tutor-agreement/tutor-agreement.component';
import { RepositoryService } from '../../../services/repositories/repository.service';
import { FileValidationService } from '../../../services/support/file-validation.service';

@Component({
  selector: 'app-applicant-tutor',
  templateUrl: './applicant-tutor.component.html',
  styleUrls: ['./applicant-tutor.component.css']
})
export class ApplicantTutorComponent implements OnInit {
  fill3Flag: boolean;
  fileErrorMsg3: string;
  fileErrorMsg2: string;
  fileErrorMsg1: string;
  fileErrorMsg: string;
  message3: string;
  message2: string;
  first_name: string;
  last_name: string;
  applicant: ApplyTeachModel = {};
  interviewDates: string;
  interviewDates2: string;

  interview_date_val: string;
  interview_time_val: string;
  interview_location_val: string;

  status_obj = { msg: '', status_code: '' };

  constructor(@Inject(WINDOW) private window: Window, 
    private dialog: MatDialog,
    private elem: ElementRef,
    private newTutorService: NewTutorService,
    private repositoryService: RepositoryService,
    private fileValidationService: FileValidationService,
  ) {
    this.repositoryService.userInfo.subscribe(
      (res) => {
        this.first_name = res['first_name'], this.last_name = res['last_name'];
      });
  }

  ngOnInit() {
    this.newTutorService.showTutorApplication().subscribe(
      (res) => {
      console.log('-----------res------------');
      console.log(res);
      this.reloadData(res);
      }, 
      (err) => console.log(err));
  }

  reloadData(res) {

    this.applicant = res;

    if (this.applicant.condition === undefined) {
      this.applicant = res['dataCon'].applyInfo;
    }

    if (this.applicant != null && this.applicant !== undefined) {
      this.interviewDates = this.applicant['interview_slots'];

      if (this.applicant.condition === 'update') {
        this.status_obj.msg = 'Your application needs an update';
        this.status_obj.status_code = 'update';
      }
      if (this.applicant.condition === 'pending') {
        this.status_obj.msg = 'Your application is pending for review';
        this.status_obj.status_code = 'pending1';
      }
      if (this.applicant.condition === 'interview') {
        this.status_obj.msg = 'Please select a date and place for your interview';
        this.status_obj.status_code = 'interview';
      }
      if (this.applicant.condition === 'pending_interview') {
        this.status_obj.msg = 'Your interview is booked at (' + this.applicant['interview_time'] + '). ';
        this.status_obj.status_code = 'pending2';
      }
      if (this.applicant.condition === 'approved') {
        this.status_obj.msg = 'Your application has been approved';
        this.status_obj.status_code = 'approved';
      }
      if (this.applicant.condition === 'contract_signed') {
        this.status_obj.msg = 'Your application has been approved';
        this.status_obj.status_code = 'contract_signed';
      }
      if (this.applicant.condition === 'declined') {
        this.status_obj.msg = 'Your application has been declined for the moment being';
        this.status_obj.status_code = 'declined';
      }

      console.log(this.applicant)
    }
  }

  onSubmit(loginForm) {
    console.log(loginForm);
    const ids = this.elem.nativeElement.querySelector('#image').files;
    const apps = this.elem.nativeElement.querySelector('#application').files;
    const file = ids[0];
    const app = apps[0];

    console.log(app);
    console.log(file);

    if (file == null) {
      console.log('nonono');
      this.fileErrorMsg1 = 'File is required';
    } else if (app == null) {
      console.log('Still No');
      this.fileErrorMsg2 = 'File is required';
      this.fileErrorMsg1 = '';
    } else {
      this.fileErrorMsg1 = '';
      this.fileErrorMsg2 = '';
      this.fileErrorMsg3 = '';

      const file1Size = Math.round(file.size / 1024 * 100) / 100;
      const file2Size = Math.round(app.size / 1024 * 100) / 100;

      if (!(this.fileValidationService.validateImage(file) && file1Size < 1500)) {
        this.fileErrorMsg1 = 'Your image file should be smaller than 1MB, and of  image type.';
      } else if (!(this.fileValidationService.validateFile(app) && file2Size < 2000)) {
        this.fileErrorMsg2 = 'Your transcript should be smaller than 2MB, and of  pdf, dox or image type.';
      } else {
        this.fileErrorMsg2 = '';
        console.log('Congrats');

        const formData = new FormData();
        formData.append('photo_id', file, file.name);
        formData.append('transcript', app, app.name);
        formData.append('_method', 'put');

        this.updateTutorInfo(formData);
      }
    }
  }

  updateTutorInfo(formData) {
    this.newTutorService.updateTutorApplication(formData).subscribe(
      (res) => {
        console.log(res);
        this.repositoryService.saveApplicantSession(res);
        this.fileErrorMsg = '- Thank you, files have been saved.';
        // window.location.reload();
        this.reloadData(res);
      },
      (error) => {
        console.log(error);
        this.fileErrorMsg = '- Sorry, something went wrong.';
      }
    );
  }

  readAgreement() {
    const dialogRef = this.dialog.open(TutorAgreementComponent, {
      width: '700px',
    });
  }

  confirmInterviewDate() {
    const formData = new FormData();
    const interview_date = document.getElementsByName('interview_date');
    const interview_time = document.getElementsByName('interview_time');
    const interview_location = document.getElementsByName('interview_location');

    for (let i = 0; i < interview_date.length; i++) {
      if (interview_date[i]['spellcheck']) {
        this.interview_date_val = interview_date[i]['textContent'];
        // console.log(interview_date_val);
        break;
      }
    }
    for (let i = 0; i < interview_time.length; i++) {
      if (interview_time[i]['spellcheck']) {
        this.interview_time_val = interview_time[i]['textContent'];
        // console.log(interview_time_val);
        break;
      }
    }
    for (let i = 0; i < interview_location.length; i++) {
      if (interview_location[i]['spellcheck']) {
        this.interview_location_val = interview_location[i]['textContent'];
        // console.log(interview_location_val);
        break;
      }
    }

    if (this.interview_date_val != null && this.interview_time_val != null && this.interview_location_val != null) {
      console.log(this.interview_date_val);
      console.log(this.interview_time_val);
      console.log(this.interview_location_val);
      const formData = new FormData();
      let interview_details = this.interview_date_val + this.interview_time_val + this.interview_location_val;
      formData.append('interview', interview_details);
      formData.append('_method', 'put');
      this.updateTutorInfo(formData);
    }
  }
}
