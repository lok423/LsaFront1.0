import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Component, OnInit, ElementRef , Inject} from '@angular/core';
import { Router } from '@angular/router';
import { NewTutorService } from '../../../services/servercalls/new-tutor.service';
import { AuthService } from '../../../services/security/auth.service';
import { ApplyTeachModel } from '../../../models/ApplyTeachModel';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from '@angular/forms';
import { RepositoryService } from '../../../services/repositories/repository.service';
import { FileValidationService } from '../../../services/support/file-validation.service';
import { UserService } from '../../../services/servercalls/user.service';
import { SideHelperService } from '../../../services/helpers/side-helper.service';
import * as moment from 'moment';


@Component({
  selector: 'app-apply-teach',
  templateUrl: './apply-teach.component.html',
  styleUrls: ['./apply-teach.component.css']
})

export class ApplyTeachComponent implements OnInit {
  file: any;
  fileValidator = { status: false, fileTips: '' }
  error:string;
  minDOB = new Date(1929, 0, 1);
  maxDOB = new Date(2020, 0, 1);
  DatePopUp: any;
  appForm: FormGroup;
  formData = new FormData();
  userInfo: any;
  errorMessage: string;
  locations: string[] = ['Auckland Central', 'Auckland North', 'Auckland West', 'Auckland South', 'Auckland East', 'Christchurch', 'Dunedin', 'Hamilton', 'Tauranga', 'Wellington Central', 'Hutt Valley', 'Porirua', 'Kapiti Coast'];
  disciplines: string[] = ['Math', 'Physics', 'Chemistry', 'Biology', 'Science', 'Geography', 'Social Studies', 'Information System', 'Accounting', 'Economics', 'Finance', 'English', 'Maori', 'French', 'German', 'Spanish', 'Chinese', 'Japanese'];
  curriculums: string[] = ['(NCEA) National Certificates of Educational Achievement', '(CIE) Cambridge', '(IB) International Baccalaureate'];
  emailVerifyStatus = false;

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, 
    private repositoryService: RepositoryService,
    private userService: UserService,
    private NewTutorService: NewTutorService,
    private FileValidationService: FileValidationService,
    private SideHelperService: SideHelperService,
    private router: Router,
    private elem: ElementRef,
    private formBuilder: FormBuilder,
  ) {
    let now = moment();
    this.formData = new FormData();
    this.getUserInfo()
  }

  ngOnInit() {
    this.createForm();
    this.DatePopUp = (d: Date): boolean => {
      const year = d.getFullYear();
      return year > 1929 && year < 2020;
    }
  }

  getUserInfo() {
    this.userService.showUserInfo().subscribe(
      (res) => {
        console.log(res);
        if (res['dataCon'].userBasic.verified === '1') {
          this.emailVerifyStatus = true;
        } else {
          this.emailVerifyStatus = false;
        }
        this.userInfo = Object.assign(res['dataCon'].userBasic, res['dataCon'].userSecondary),
        this.setFormValuesTo(this.userInfo)
      },
      (error) => { this.errorMessage = "Sorry, we can't get to your information at this time." }
    )
  }

  createForm() {
    this.appForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z\s]*$')]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z\s]*$')]],
      phone_num_pri: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      location: ['', Validators.required],
      DOB: ['', [Validators.required, this.dateRange]],
      discipline_1: ['', Validators.required],
      discipline_2: [''],
      curriculum_1: ['', Validators.required],
      curriculum_2: [''],
      cv: [null, Validators.required],
      work_1: ['', [Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      work_1_detail: ['', [Validators.minLength(8), Validators.maxLength(150), Validators.pattern('^[a-zA-Z ]*$')]],
      work_start: ['', [Validators.pattern('^\\d{4}$'), this.yearRange]],
      work_end: ['', [Validators.pattern('^\\d{4}$'), this.yearRange]],
      sp_ques_1: [''],
      sp_ques_2: [''],
      criminal_record: ['', Validators.required],
    }, {
        validator: this.dateCompare
      })
  }

  setFormValuesTo(userInfoData) {
    this.appForm.controls['first_name'].setValue(userInfoData.first_name);
    this.appForm.controls['last_name'].setValue(userInfoData.last_name);
    this.appForm.controls['phone_num_pri'].setValue(userInfoData.phone_num_pri);
    this.appForm.controls['location'].setValue(userInfoData.location);
    this.appForm.controls['DOB'].setValue(userInfoData.DOB);
    this.appForm.updateValueAndValidity();
  }

  dateRange(AC: FormControl) {
    if (AC.value) {
      let year = parseInt(moment(AC.value.toString()).format('YYYY'));
      if (year < 1930) return { mindob: {} }
      if (year > 2019) return { maxdob: {} }
      return null;
    }
  }

  yearRange(AC: FormControl) {
    if (AC.value) {
      let year = parseInt(AC.value);
      if (year < 1950) return { min: {} }
      if (year > 2019) return { max: {} }
      return null;
    }
  }

  dateCompare(AC: AbstractControl) {
    let startYear = parseInt(AC.get('work_start').value);
    let endYear = parseInt(AC.get('work_end').value);
    return (startYear > endYear) ? { not: {} } : null
  }


  onSubmit() {
    this.onSubmitCheckValid()
  }

  fileValidation() {
    this.file = this.elem.nativeElement.querySelector('#cv').files[0];
    console.log('cv file', this.file);
    this.fileValidator.status = this.FileValidationService.validateFile(this.file);
    this.fileValidator.fileTips = '';
    if (!this.fileValidator.status) {
      this.fileValidator.fileTips = 'File is not valid. ';
    }
  }

  onSubmitCheckValid() {
    if (this.appForm.invalid) {
      console.warn(this.appForm.invalid)
      this.errorMessage = 'Not all required fields are filled';
    } else {
      if (!this.fileValidator.status) {
        this.errorMessage = 'File is not valid'
        console.warn('File is not valid')
      } else {
        console.log(this.appForm.value);
        this.processingForm(this.appForm.value)
      }
    }
  }

  processingForm(appFormValue) {
    let curriculumValueOne = "";
    let curriculumValueTwo = "";
    let disciplineValueOne = "";
    let disciplineValueTwo = "";
    for (let key of Object.keys(appFormValue)){
      if(key == "discipline_1") {
        disciplineValueOne = appFormValue[key];
      } else if(key == "discipline_2") {
        disciplineValueTwo = appFormValue[key];
      } else if(key == "curriculum_1") {
        curriculumValueOne = appFormValue[key];
      } else if(key == "curriculum_2") {
        curriculumValueTwo = appFormValue[key];
      } else {
        this.formData.append(key, appFormValue[key]);
      }
    }

    this.formData.append('curriculum', curriculumValueOne + ", " + curriculumValueTwo);
    this.formData.append('discipline', disciplineValueOne + ", " + disciplineValueTwo);
    this.formData.append('cv', this.file, this.file.name)
    this.formData.append('work_date', this.elem.nativeElement.querySelector('#workDate').value)
    this.transferDataToBack(this.formData);
  }

  transferDataToBack(formDataV) {
    this.NewTutorService.storeTutorApplication(formDataV).subscribe(
      (res) => {console.log(res)
        this.localStorage.setItem('lsaWho', res['dataCon'].xUr);
        this.router.navigate(['/app/apply/manager']);
        // window.location.reload();
      },
      (err) => {
        console.log(err),
        // this.errorMessage = 'Sorry, Something went wrong. '+ err['error'].error;
        this.errorMessage = 'Sorry, Something went wrong. '+ 'Please verify your email account first.';
      }
    )
  }

  mouseEnter(m) {
    // console.log('email verify status 2222: ', this.emailVerifyStatus);
    if (this.emailVerifyStatus === false) { this.SideHelperService.sendMessage('Verify Email'); } 
    else { this.SideHelperService.sendMessage(m); }
  }
}