import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-tutor-report-dialog',
  templateUrl: './tutor-report-dialog.component.html',
  styleUrls: ['./tutor-report-dialog.component.css']
})
export class TutorReportDialogComponent implements OnInit {
  reportContent = '';
  constructor(
    private dialogRef: MatDialogRef<TutorReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }

  ngOnInit() {
    console.log('report data', this.data);
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (this.reportContent !== '' && this.reportContent.trim() !== '') {
      let data = {
        s_report: this.reportContent
      };
      console.log(data);
      this.dialogRef.close(data);
    } else {
      this.dialogRef.close();
    }
  }

}
