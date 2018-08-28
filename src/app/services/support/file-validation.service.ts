import { Injectable } from '@angular/core';

@Injectable()
export class FileValidationService {
  fileMsg: boolean;
  myFile: File;

  constructor() {

   }          
    // true =  File/image validated successfully 
    // false = Your file should be smaller than 1MB
    // false = Please upload correct file type, like: jpg, jpeg, bmp, png

  validateImage(e) {
    this.myFile = e;
    console.log('file received')
    if (this.myFile === null) {
      return this.fileMsg = false;
    } else {
      const fileSize = this.myFile.size / 1024 / 1024;
      const fileType = this.myFile.name.split('.').pop();
      if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'png') {
        if (fileSize <= 2.0) {
          return this.fileMsg = true;
        } else {
          return this.fileMsg = false;
        }
      } else {
        return this.fileMsg = false;
      }   
    }
  }

  validateFile(b){
    this.myFile = b;
    console.log('file received')
    if (this.myFile === null) {
      return this.fileMsg = false;
    } else {
      const fileSize = this.myFile.size / 1024 / 1024;
      const fileType = this.myFile.name.split('.').pop();
      if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'png' || fileType === 'pdf' || fileType === 'docx') {
        if (fileSize <= 2.0) {
          return this.fileMsg = true;
        } else {
          return this.fileMsg = false;
        }
      } else {
        return this.fileMsg = false;
      }
    }
  }


}