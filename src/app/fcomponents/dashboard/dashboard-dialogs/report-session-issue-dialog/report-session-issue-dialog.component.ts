import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-issue-dialog',
  templateUrl: './report-session-issue-dialog.component.html',
  styleUrls: ['./report-session-issue-dialog.component.css']
})
export class ReportSessionIssueDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ReportSessionIssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string, ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
  save() {
      this.dialogRef.close();
    }
  }