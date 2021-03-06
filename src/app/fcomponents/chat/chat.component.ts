import { Component, OnInit, Input, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, AfterViewChecked, AfterContentChecked,AfterContentInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem,MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MessengerHelperService } from '../../services/helpers/messenger-helper.service';

import { Message, DrawImg, UploadFile, UploadImg } from '../../models/MessageModel';
//import { User } from './shared/model/user';
import { SocketService} from '../../services/servercalls/socket.service';
import { UserService  } from '../../services/servercalls/user.service';

import { DrawboardComponent } from './drawboard/drawboard.component';
import { PreviewImgComponent } from './preview-img/preview-img.component';
import { HttpResponse } from '@angular/common/http';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';
//const upload_URL ='http://localhost:8080/api/upload-file';
const upload_URL =environment.messengerApiUrl+'/api/upload-file';
//const download_URL =environment.messengerApiUrl+'/api/download-file/';
//const download_URL = "https://storage.googleapis.com/learnspacemessenger/";
import { CommonSupportService } from '../../services/support/common-support.service';

import { first } from 'rxjs/operators';
import { Subscription } from '../../../../node_modules/rxjs';
import {Event} from '../../models/MessageEventModel';
import {User} from '../../models/MessengerUserModel';
import { environment } from '../../../environments/environment.prod';
import { RepositoryService } from '../../services/repositories/repository.service';
import { ResizeEvent } from 'angular-resizable-element';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  imgUrl: string;
imageData;
  drawboard=false;
  ioConnection: any;
  messageContent: string;
  socketId = null;
  selectedUser = null;
  messages = [];
  msgData = null;
  userList = [];
  username:string;
  selfsockets=[];
  drawImg=null;
  drawWidth=null;
  drawHeight=null;

@Input() emoji=null;
@Input() emoji_status=false;
@ViewChild('inputMessage') private input;
@ViewChild('upload_input') input_file: ElementRef;
@ViewChild('upload_image') input_img: ElementRef;

user_profile_photo: string;
userRepositoryService: Subscription;


selectedFile: File = null;
uploadedPercentage = 0;
showMessage = false;
upload_message: String = '';
showProgressBar = false;
selectedImg: File = null;

users: User[] = [];

showChatPage=true;
searchUsers :User[]=[];
searchText:string='';

showSpinner :boolean =true;
profile_status_list:boolean =false;
profile_status:string='active';
download_URL = "https://storage.googleapis.com/learnspacemessenger/";



currentUser:any ={user_id:Number,username:''};
contactList:User[] = [];

total_unread_count = 0;


@Output() total_unread_messages: EventEmitter<number> = new EventEmitter<number>();
@Output() dropdownClose: EventEmitter<Event> = new EventEmitter<Event>();


//@ViewChild('scrollMe') private myScrollContainer: ElementRef;



  // getting a reference to the overall list, which is the parent container of the list items
  //@ViewChildren('scrollMe') private myScrollContainer: ElementRef;

  // getting a reference to the items/messages within the list

  constructor(private socketService: SocketService,
    public dialog: MatDialog,
    private http: HttpClient,
    private userService:UserService,
    private repositoryService: RepositoryService,
    private commonSupportService: CommonSupportService,
    private messengerHelperService: MessengerHelperService


  ) {
      //this.loadAllUsers();
    this.getContactList();
    this.currentUser = {username:localStorage.getItem('lsaUserName'),user_id:Number(localStorage.getItem('lsaUserId'))};
    console.log(this.currentUser);
}

  ngOnInit(): void {
    this.dataInit();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.initIoConnection();
    }, 100);
    this.openContact();

  }

  draw() {
    const dialogRef = this.dialog.open(DrawboardComponent, {
      //width: (document.body.clientWidth) + 'px',
      width: '90%',
      height: '90%',
      data: {data : this.imageData}
    });
    console.log('-----' + document.body.clientWidth );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      this.sendDrawImg(dialogRef.componentInstance.imgageSrc);
    });
  }

  openEmoji(emoji_status) {
    if(emoji_status ==true){
      this.emoji_status=false;
    }else{
      this.emoji_status=true;
    }
  }

  closeDrawboard(event){
    this.drawboard=false;
  }

  closeEmoji(event) {
    this.emoji_status=false;
  }

  addEmojiText(emoji){
    this.input.nativeElement.focus();
    let startPos = this.input.nativeElement.selectionStart;
    let value = this.input.nativeElement.value;
    this.input.nativeElement.value=
    value.substring(0, startPos) + emoji.emoji.native + value.substring(startPos, value.length);
    if(!this.messageContent){
      this.messageContent =emoji.emoji.native;
    }else{
      this.messageContent=value.substring(0, startPos) + emoji.emoji.native + value.substring(startPos, value.length);
    }
    console.log(emoji);
  }

  selectUser(user){
    console.log(user);
    this.selectedUser=user;

    this.updateSelectedUser();
    var count = user.unreadCount;
    this.total_unread_count= this.total_unread_count-count;
    this.total_unread_messages.emit(this.total_unread_count);
    user.unreadCount=0;
    this.updateUnreadMessage();

    //console.log(user);


  }

  private loadOnlineUser(contactList,userList){
      console.log("userlist",userList);
      console.log("alllist",contactList);

    for(var i=0;i<contactList.length;i++){
      var found =false;
      for(var j=0;j<userList.length;j++){
        if(contactList[i].user_id==userList[j].user_id){
          //allUsers[i].channelid=userList[j].channelid;
          console.log("true");

          contactList[i].online = true;
          found =true;
        }
      }
      if(found==false){
        contactList[i].online =false;
        //allUsers[i].channelid='';
      }
    }
  }


  private initIoConnection(): void {

    this.socketService.initSocket();
    this.socketService.init(this.currentUser);
    //console.log("emit ", this.username);
    this.ioConnection = this.socketService.socket.on('userList',(userList,channelid) => {
      if(this.socketId === null){
          this.socketId = channelid;
      }
      this.userList = userList;
      this.getselfsockets();
      this.updateSelectedUser();
      //this.loadAllUsers();
      setTimeout(() => {
      this.loadOnlineUser(this.contactList,this.userList);
    }, 1000);

      //console.log(userList);
      //console.log("userList",this.userList);
      //console.log("socketId",this.socketId);
  });

  this.ioConnection = this.socketService.onMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
      this.loadNewMsg();
      this.countInComingMsg(message);
      this.updateUnreadMessage();

      console.log(message);

    });

  this.ioConnection = this.socketService.socket.on('exit', (userList) => {
    this.userList = userList;
    this.getselfsockets();
    this.updateSelectedUser();
    //this.loadAllUsers();
    setTimeout(() => {
    this.loadOnlineUser(this.contactList,this.userList);
  }, 1000);

  });

  this.ioConnection = this.socketService.onDrawImg()
    .subscribe((img: DrawImg) => {
      this.messages.push(img);
      this.loadNewMsg();
      this.countInComingMsg(img);
      this.updateUnreadMessage();



      console.log("receive draw:");
    });

    this.ioConnection = this.socketService.onFile()
      .subscribe((file: UploadFile) => {
        this.messages.push(file);
        this.loadNewMsg();
        this.countInComingMsg(file);
        this.updateUnreadMessage();



        console.log("receive file:",file);

      });

      this.ioConnection = this.socketService.onImg()
        .subscribe((file: UploadImg) => {
          this.messages.push(file);
          this.loadNewMsg();
          this.countInComingMsg(file);
          this.updateUnreadMessage();



          console.log("receive file:",file);

        });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });


    this.ioConnection = this.socketService.onOldMessages()
      .subscribe((message: any) => {
        for(var i=0;i<message.length;i++){
          this.messages.push(message[i]);
        }
        this.loadNewMsg();
        this.countUnreadHistory(this.messages);
        console.log("messages history:" ,this.messages);
        //this.scrollToBottom();
        this.showSpinner=false

      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });

  }
  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
          fromid: this.socketId,
            toid : this.selectedUser.channelid,
          msg : message,
          sender_id : this.currentUser.user_id,
          receiver_id : this.selectedUser.user_id,
          //createAt: Date.now(),
          selfsockets: this.selfsockets,
          createdAt: new Date()
    });


    this.messageContent = null;
  }

  getselfsockets(){
    for(var i =0; i<this.userList.length;i++){
      if(this.userList[i].user_id==this.currentUser.user_id){
        this.selfsockets =this.userList[i].channelid;
      }
    }
    console.log("selfsockets",this.selfsockets);

  }

  updateSelectedUser(){
    if(this.selectedUser){
      for(var i =0; i<this.userList.length;i++){
        if(this.userList[i].user_id==this.selectedUser.user_id){
          this.selectedUser.channelid =this.userList[i].channelid;
        }
      }
    }
    console.log("selecteduser", this.selectedUser);
  }

handleDrawOutput(output){
  this.drawImg=output;
  console.log("output",this.drawImg);
  this.sendDrawImg(this.drawImg);
}

public sendDrawImg(img: string): void {
  if (!img) {
    return;
  }
  this.socketService.sendDrawImg({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        drawImg:img,
        sender_id : this.currentUser.user_id,
        receiver_id : this.selectedUser.user_id,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

  });
}

public sendFile(path: string, name: string): void {
  if (!path) {
    return;
  }
  this.socketService.sendFile({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        filename: name,
        file :path,
        sender_id : this.currentUser.user_id,
        receiver_id : this.selectedUser.user_id,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

  });
}
public sendImg(path: string, name: string): void {
  if (!path) {
    return;
  }
  this.socketService.sendImg({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        imgname: name,
        img :path,
        sender_id : this.currentUser.user_id,
        receiver_id : this.selectedUser.user_id,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

  });
}

previewImg(img){
  console.log(img);
  const dialogRef = this.dialog.open(PreviewImgComponent, {

    data: { img }
  });
}


  onFileSelected(event) {
    console.log("we get here");
    this.selectedFile = <File>event.target.files[0];
    this.selectedImg=null;
    this.input_img.nativeElement.value=null;
    console.log(this.selectedFile);
  }
  onImgSelected(event) {
    console.log("we get here");
    var reader = new FileReader();
    this.selectedFile=null;
    this.input_file.nativeElement.value=null;

    this.selectedImg = <File>event.target.files[0];
    reader.onload = e => this.imgUrl = reader.result;

        reader.readAsDataURL(this.selectedImg);


    console.log(event);
  }

  onUpload(type) {
    const fd = new FormData();
    this.showMessage = false;
    if(type=='file'){
      fd.append('file', this.selectedFile, this.selectedFile.name);
    }
    if(type =='img'){
      fd.append('file', this.selectedImg, this.selectedImg.name);
    }
    this.http.post(upload_URL, fd, {
      reportProgress: true, observe: 'events'
    }).subscribe( (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          //this.slimLoadingBarService.start();
          this.showProgressBar=true;
          break;
        case HttpEventType.Response:
        console.log("response", event.body );
          //this.slimLoadingBarService.complete();
          this.upload_message = "Uploaded Successfully";
          this.showMessage = true;
          if(event.body.file_path){
            var file_path = event.body.file_path;
            var file_name = event.body.file_name;
            if(type=='file'){ this.sendFile(file_path,file_name);
}
            if(type =='img'){
              console.log("sendimg")
            this.sendImg(file_path,file_name);
          }


            //console.log(file_path);
          }
          this.showProgressBar=false;
          this.uploadedPercentage=0;
          break;
        case 1: {
          if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)){
            this.uploadedPercentage = event['loaded'] / event['total'] * 100;
            this.selectedFile = null;
            this.selectedImg = null;
            //this.slimLoadingBarService.progress = Math.round(this.uploadedPercentage);
          }
          break;
        }
      }
    },
    error => {
      console.log(error);
      this.upload_message = "Something went wrong";
      this.showMessage = true;
      //this.slimLoadingBarService.reset();
    });
  }

  clickUploader(){
    console.log("upload click");
    this.input_file.nativeElement.click();
  }

  clickImgUploader(){
    this.input_img.nativeElement.click();
  }


/*
  private loadAllUsers() {
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.users = users;
          console.log(this.messages);
          this.users.forEach(x=>{x.online=false,x.newestMsg='',x.unreadCount=0});
          console.log(this.users);
          for(var i=0; i<this.users.length;i++){
            if(this.users[i].username===this.currentUser.username){
              this.users.splice(i,1);
            }
          }
          //this.searchUsers = this.users;
          console.log(this.searchUsers);
      });
  }*/


  disconnect(){
    console.log("disconnect");
    this.ioConnection=this.socketService.socket.close();
  }

  input_file_reset(){
    this.selectedFile=null;
    this.selectedImg =null;
    //console.log(this.input_file);
    this.input_file.nativeElement.value=null;
    this.input_img.nativeElement.value=null;
  }

  loadNewMsg(){
    for(var j=0;j<this.contactList.length;j++){
      for(var i=0;i<this.messages.length;i++){
        if(this.messages[i].sender_id==this.contactList[j].user_id || this.messages[i].receiver_id==this.contactList[j].user_id){

          this.contactList[j].newestMsg=this.messages[i];
        }
      }
    }
  }

countInComingMsg(msg){
  console.log(msg);
  for(var j=0;j<this.contactList.length;j++){
    if(msg.sender_id==this.contactList[j].user_id){
      this.contactList[j].unreadCount++;
      this.total_unread_count++;
    }
}
this.total_unread_messages.emit(this.total_unread_count);
}

countUnreadHistory(msgList){
  for(var j=0;j<this.contactList.length;j++){
    for(var i=0;i<msgList.length;i++){
      if(  msgList[i].sender_id==this.contactList[j].user_id){
        if(msgList[i].read==false){
          this.contactList[j].unreadCount++;
          this.total_unread_count++;
                console.log("unread +1");
        }
        console.log(msgList[i].sender_id,this.contactList[j].user_id,localStorage.getItem('lsaWho'));

      }
/*
      if(localStorage.getItem('lsaWho')=="1" && msgList[i].receiver_id==this.contactList[j].user_id&& msgList[i].learner_read==false){
        this.contactList[j].unreadCount++;
        this.total_unread_count++;
        console.log("learner +1");
      } if(localStorage.getItem('lsaWho')=="3" && msgList[i].sender_id==this.contactList[j].user_id&& msgList[i].tutor_read==false){
        this.contactList[j].unreadCount++;
        this.total_unread_count++;
              console.log("tutor +1");
      }*/


    }

}
this.total_unread_messages.emit(this.total_unread_count);
}

showSearchUser(key){
  const result = this.contactList.filter(user =>
    user.first_name.toLowerCase().includes(key.toLowerCase()) || user.last_name.toLowerCase().includes(key.toLowerCase()));
  this.searchUsers = result;
}

renderDate(date:Date) {
  date = new Date(date);
  const today = new Date
  const yesterday = new Date; yesterday.setDate(today.getDate() - 1)
  if(date.toLocaleDateString() == today.toLocaleDateString()){
    return this.formatDate(date,false);
  }else if (date.toLocaleDateString() == yesterday.toLocaleDateString()) {
    return 'Yesterday'
  }
  return this.formatDate(date,true);
}

formatDate(date,display_date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  if(display_date==false){  return strTime;
}
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
}

showPorfileStatusList(){
  /*
  if(this.profile_status_list==true){
    return this.profile_status_list=false;
  }else{
    return this.profile_status_list=true;
  }*/
}

changeStatus(status){
  /*
  if(status=='active'&& this.profile_status=='offline'){
    this.initIoConnection();
    $("#profile-img").removeClass("offline");
    $("#profile-img").addClass("online");
    this.profile_status='active';
  }
  if(status=='offline'&& this.profile_status=='active'){
    this.disconnect();
    $("#profile-img").removeClass("online");
    $("#profile-img").addClass("offline");
    this.profile_status='offline';

    this.users.forEach(x=>x.online=false);
    this.searchUsers=this.users;
    console.log("u", this.users);
  }
  return this.profile_status_list=false;
  */
}

getContactList(){
  this.userService.getContacts().subscribe(users => {
    console.log(users);

      for(var key in users['dataCon']){
        var user = users['dataCon'][key];
        //console.log(user);
        var assign = Object.assign({online:false,newestMsg:'',unreadCount:0, userImg: this.commonSupportService.findUserImg(user.user_id) },user);
        this.contactList.push(assign);
      }
      this.searchUsers = this.contactList;
      console.log(this.searchUsers);

  });
}

dataInit() {
  this.repositoryService.currentUserData();
  this.userRepositoryService = this.repositoryService.userInfo.subscribe(
    (res) => {// console.log(res);
      if (res.hasOwnProperty("user_id")) {
        var userInfo = res;
        if (userInfo['user_profile_photo']) {
          let ver = new Date().getTime();
          // console.log("timestamp for ver is: " + ver);
          // console.log(this.baseImgUrl + this.userInfo['user_profile_photo']);
          // console.log(this.userInfo['user_profile_photo']);
          // try {
          //   this.user_profile_photo = this.baseImgUrl + this.userInfo['user_profile_photo'] + "?ver=" + ver;
          // } catch(err) {
          //   console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
          //   console.log(err);
          // }
          // this.user_profile_photo = this.baseImgUrl + this.userInfo['user_profile_photo'] + "?ver=" + ver;
          this.user_profile_photo = this.commonSupportService.prepareUserImgUrl() + "?ver=" + ver;
        } else {
          this.user_profile_photo = '../../../../assets/default_pics/default-cp.jpg';
        }
      }
    }, (error) => console.log(error)
  );
}

closeMessenger(){
  this.dropdownClose.emit();
}


openContact(){
  this.messengerHelperService.trigger.subscribe(value => {
    console.log(value);
    for(var i=0;i<this.contactList.length;i++){
      if(this.contactList[i].user_id == value){
        this.selectedUser = this.contactList[i];
        var count = this.contactList[i].unreadCount;
        console.log(count);
        this.total_unread_count= this.total_unread_count-count;
        this.total_unread_messages.emit(this.total_unread_count);
        this.contactList[i].unreadCount=0;
        this.updateSelectedUser();
        this.updateUnreadMessage();

}
}
      });
}

updateUnreadMessage(){
  if(this.selectedUser){
    this.socketService.updateUnreadMsg(
      {selectedUserId:this.selectedUser.user_id,
      currentUserId:this.currentUser.user_id,
      createdAt: new Date(),
      role: localStorage.getItem('lsaWho')
    });
  }
}

messageCheck(){
  //console.log("user click");
  if(this.selectedUser){
    var count = this.selectedUser.unreadCount;
    this.total_unread_count= this.total_unread_count-count;
    this.total_unread_messages.emit(this.total_unread_count);
    this.selectedUser.unreadCount=0;
  }
}




}
