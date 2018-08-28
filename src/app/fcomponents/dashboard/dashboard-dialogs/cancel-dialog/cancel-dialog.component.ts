import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';


@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})
export class CancelDialogComponent implements OnInit {
  rescheduleStatus = false;
  withTwelveHours: boolean;
  constructor(
    private dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.withTwelveHours = this.data[2];
    console.log(this.withTwelveHours);
    // Remove padding top and padding bottom gaps
    $('.dialog1 .mat-dialog-container').css({'padding-top':'0', 'padding-bottom':'0'});
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close('yes');
  }
  reschedule() {
    console.log('reschedule the lesson --------');
    this.rescheduleStatus = true;
    this.dialogRef.close(this.rescheduleStatus);
  }
}
