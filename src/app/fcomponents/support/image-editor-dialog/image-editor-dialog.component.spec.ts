import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorDialogComponent } from './image-editor-dialog.component';

describe('ImageEditorDialogComponent', () => {
  let component: ImageEditorDialogComponent;
  let fixture: ComponentFixture<ImageEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
