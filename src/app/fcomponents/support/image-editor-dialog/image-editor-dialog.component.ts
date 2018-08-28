import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-image-editor-dialog',
  templateUrl: './image-editor-dialog.component.html',
  styleUrls: ['./image-editor-dialog.component.css']
})
export class ImageEditorDialogComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  status=false;
  errorMessage:string;
  imageOutput:string;
  naStatus=false;
  aspectCons: any = '';
  constructor(
    private elem: ElementRef,
    private dialogRef:MatDialogRef<ImageEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:string,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.aspectCons = this.data[0]
    this.imageOutput=this.data[1]
  }

  fileChangeEvent(event: any): void {
    this.naStatus=true
    this.imageChangedEvent = event;}

  imageCropped(image: string) {
    this.croppedImage = image;
    this.status=true;}

  imageLoaded() {this.errorMessage=""}

  loadImageFailed() {this.errorMessage="The file is invalid."}

  subImage(){
    console.log(this.croppedImage)
    
    if(this.croppedImage){
      console.log('qwer')
      this.dialogRef.close(this.croppedImage);
    }
    else{
      this.errorMessage="There is no image."
    }
  }
}
