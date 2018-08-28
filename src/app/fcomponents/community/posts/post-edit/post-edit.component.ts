import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { TutorService } from '../../../../services/servercalls/tutor.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ImageEditorDialogComponent } from '../../../support/image-editor-dialog/image-editor-dialog.component';
// import '../../../../../assets/ckeditor/ckeditor';

// declare var CKEDITOR: any;

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  post_image: string;
  passId: string;
  toPublish: string;
  errorMessage: string;
  update: boolean;
  // @ViewChild('myckeditor') public ckeditor: any;
  newPostInfo = new FormData();
  post: any;
  postForm: FormGroup;
  mycontent= '';
  dialogRef: MatDialogRef<ImageEditorDialogComponent>;
  image_change=false;
  editor_change=false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: TutorService,
    public router: Router,
    private dialog: MatDialog,
  ) {
    // this.determineActionType()
  }

  ngOnInit() {
    this.initiateForm()
    // this.ckEditorProcess()
  }

  // ckEditorProcess() {
  //   this.ckeditor = CKEDITOR.replace('editor1', {
  //     extraPlugins: "mathjax,smiley,preview,eqneditor,base64image,tableresize,autogrow",
  //     removePlugins: "about,image",
  //     mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',
  //     language: 'en',
  //     allowedContent: true,
  //     htmlEncodeOutput: true,
  //     on:
  //       {
  //         instanceReady: function (ev) {
  //           // Output paragraphs as <p>Text</p>.
  //           this.dataProcessor.writer.setRules('p', { indent: false, breakAfterOpen: false });
  //         }
  //       }
  //   });
  //   this.ckeditor.on('change',  (ev) =>{
  //     this.mycontent = CKEDITOR.instances.editor1.getData();
  //      this.editor_change=true;
  //     console.log(this.editor_change)
  //   });
  //   CKEDITOR.on('instanceReady', (ev) =>{
  //     // Ends self closing tags the HTML4 way, like <br>.
  //     ev.editor.dataProcessor.writer.selfClosingEnd = '>';
  //   });
  // }

  // determineActionType() {
  //   if (this.route.snapshot.params['id']) {
  //     let postId = this.route.snapshot.params['id'];
  //     this.update = true;
  //     this.getOriginalPost(postId)
  //   }
  //   else {
  //     this.update = false;
  //     this.initiateForm()
  //   }
  // }

  // getOriginalPost(postId) {
  //   this.postService.showTutorPost(postId).subscribe(
  //     (res) => { this.setFormData(res['dataCon'].tutorPost) },
  //     (error) => { console.warn(error), this.errorMessage = 'We cannot get this post at this time.' }
  //   )
  // }

  initiateForm() {
    this.post_image = "../../../../assets/default_pics/default-post.jpg"

    this.postForm = this.formBuilder.group({
      postType: ['1', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      subTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      tags: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      publish: []
    });
  }

  // setFormData(post) {
  //   this.post = post
  //   if (post.post_image) { this.post_image = 'http://ls3.api2/community/postpics/'+post.post_image; }
  //   if (this.post) {
  //     CKEDITOR.instances.editor1.setData(this.post.post_body_1);
  //     this.postForm.controls["postType"].setValue(this.post.post_type);
  //     this.postForm.controls["title"].setValue(this.post.post_title);
  //     this.postForm.controls["subTitle"].setValue(this.post.post_subTitle);
  //     this.postForm.controls["description"].setValue(this.post.post_des);
  //     this.postForm.controls["tags"].setValue(this.post.post_tags);
  //     this.postForm.controls["publish"].setValue(this.post.publish);
  //     this.postForm.updateValueAndValidity();
  //   }
  // }

  // savePost() {
  //   console.log(this.postForm.dirty, this.image_change, this.editor_change)
  //   if (this.postForm.dirty || this.image_change || this.editor_change) {
  //     if (this.postForm.value.publish == true) {
  //       if (this.postForm.valid) {
  //         this.toPublish = '1';
  //         this.getSubmitData()
  //       }
  //       else { this.errorMessage = "Post is not complete to publish" }
  //     }
  //     else {
  //       if (this.postForm.value.title.length > 2) {
  //         this.toPublish = '0';
  //         this.getSubmitData()
  //       }
  //       else { this.errorMessage = "There must be a title to save this post." }
  //     }
  //   }
  //   else { this.errorMessage = "You haven't made any changes yet." }
  // }

  // getSubmitData() {
  //   this.mycontent = CKEDITOR.instances.editor1.getData();
  //   console.log(this.mycontent);
  //   if (this.image_change) {
  //     fetch(this.post_image).then(
  //       (res) => res.blob()).then(
  //       (blob) => {
  //         console.log('bbbbb', blob);
  //         this.newPostInfo.append('post_image', blob, 'a.jpeg');
  //       })
  //   }
  //   this.errorMessage = "";
  //   this.newPostInfo.append('post_title', this.postForm.value.title);
  //   this.newPostInfo.append('post_subTitle', this.postForm.value.subTitle);
  //   this.newPostInfo.append('post_des', this.postForm.value.description);
  //   this.newPostInfo.append('post_body_1', this.mycontent);
  //   this.newPostInfo.append('post_tags', this.postForm.value.tags);
  //   this.newPostInfo.append('publish', this.toPublish);
  //   this.newPostInfo.append('post_type', this.postForm.value.postType);
  //   if (this.update) { this.newPostInfo.append('_method', 'put') }
  //   console.log(this.newPostInfo)
  //   this.passData()
  // }

  passData() {
    if (this.post) { this.passId = '/' + this.post.id }
    else { this.passId = '' }
    // return console.log(this.newPostInfo)
    this.postService.storeTutorPost(this.newPostInfo, this.passId).subscribe(
      (res) => this.onPostSaved(res),
      (error) => { console.warn(error); this.errorMessage = 'Oh no, something went wrong.' }
    );
  }

  onPostSaved(a) {
    console.log(a);
    // this.router.navigate(['/app/community/search-articles/' + a.dataCon.tutorPost.id]);
  }

  imageEditorDia() {
    let dialogRef = this.dialog.open(ImageEditorDialogComponent,
      {
        panelClass: 'dialog1',
        data: [2 / 2, this.post_image],
      });
    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res)
        if (res) {
          this.post_image = res
          this.image_change = true
        }
      },
      (err) => console.warn(err)
    );
  }
}
