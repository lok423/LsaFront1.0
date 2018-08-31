import { Component, OnInit, HostListener, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  x: number;
 y: number;
 px: number;
 py: number;
 width: number;
 height: number;
 minArea: number;
 draggingCorner: boolean;
 draggingWindow: boolean;
 resizer: Function;

 @Output() dropdownClose: EventEmitter<Event> = new EventEmitter<Event>();
 @Output() total_unread_messages: EventEmitter<number> = new EventEmitter<number>();


 constructor() {
   this.x = 10;
   this.y = 40;
   this.px = 0;
   this.py = 0;
   this.width = 285;
   this.height = 455;
   this.draggingCorner = false;
   this.draggingWindow = false;
   this.minArea = 20000
 }

 ngOnInit() {
  }

 area() {
   return this.width * this.height;
 }



 onWindowPress(event: MouseEvent) {
   this.draggingWindow = true;
   this.px = event.clientX;
   this.py = event.clientY;
 }

 onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
       return;
   }
   let offsetX = event.clientX - this.px;
   let offsetY = event.clientY - this.py;

   this.x -= offsetX;
   this.y -= offsetY;
   this.px = event.clientX;
   this.py = event.clientY;
 }

 topLeftResize(offsetX: number, offsetY: number) {
   this.x -= offsetX;
   this.y -= offsetY;
   this.width += offsetX;
   this.height += offsetY;
 }

 topRightResize(offsetX: number, offsetY: number) {
   this.y -= offsetY;
   this.width -= offsetX;
   this.height += offsetY;
 }

 bottomLeftResize(offsetX: number, offsetY: number) {
   this.x -= offsetX;
   this.width += offsetX;
   this.height -= offsetY;
 }

 bottomRightResize(offsetX: number, offsetY: number) {
   this.width -= offsetX;
   this.height -= offsetY;
 }

 onCornerClick(event: MouseEvent, resizer?: Function) {
   this.draggingCorner = true;
   this.px = event.clientX;
   this.py = event.clientY;
   this.resizer = resizer;
   event.preventDefault();
   event.stopPropagation();
 }

 @HostListener('document:mousemove', ['$event'])
 onCornerMove(event: MouseEvent) {
   if (!this.draggingCorner) {
       return;
   }
   let offsetX = event.clientX - this.px;
   let offsetY = event.clientY - this.py;

   let lastX = this.x;
   let lastY = this.y;
   let pWidth = this.width;
   let pHeight = this.height;

   this.resizer(offsetX, offsetY);
   if (this.area() < this.minArea) {
       this.x = lastX;
       this.y = lastY;
       this.width = pWidth;
       this.height = pHeight;
   }
   this.px = event.clientX;
   this.py = event.clientY;
 }

 @HostListener('document:mouseup', ['$event'])
 onCornerRelease(event: MouseEvent) {
   this.draggingWindow = false;
   this.draggingCorner = false;
 }

 closeMessenger(){
   this.dropdownClose.emit();
 }

 handleUnreadCount(count){
   this.total_unread_messages.emit(count);
 }
}
