import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewTutorService } from '../../../../services/servercalls/new-tutor.service';
import { RepositoryService } from '../../../../services/repositories/repository.service';

@Component({
  selector: 'app-tutor-agreement',
  templateUrl: './tutor-agreement.component.html',
  styleUrls: ['./tutor-agreement.component.css']
})
export class TutorAgreementComponent implements OnInit {
  deviceInfos:DeviceInfo;

  constructor(@Inject(WINDOW) private window: Window, 
    private dialogRef: MatDialogRef<TutorAgreementComponent>, 
    
    private NewTutorService: NewTutorService,
    private repositoryService:RepositoryService,
  ) { }

  ngOnInit() {
    let confirmAgreeMark=document.getElementsByClassName("confirmAgreeMark")[0];
    confirmAgreeMark.addEventListener('click',showAndHideTips);

    function showAndHideTips(){
      let errorMsg=document.getElementsByClassName("errorMsg")[0];
      if(confirmAgreeMark["checked"]){
        errorMsg["style"].display='none';
      }else{
        errorMsg["style"].display='block';
      }
    }
  }

  

  onSubmit(){
    let confirmAgreeMark=document.getElementsByClassName("confirmAgreeMark");
    if(confirmAgreeMark[0]["checked"]){
      this.getDeviceInfo();

      let formData = new FormData();
      formData.append('contract_agreement', this.deviceInfos.browserType+" from " 
      +this.deviceInfos.deviceType);
      formData.append('_method', 'put');
      
      this.updateTutorInfo(formData);
    }else{
      document.getElementsByClassName("errorMsg")[0]["style"].display='block';
    }
    console.log('yes')
  }

  updateTutorInfo(formData){
    this.NewTutorService.updateTutorApplication(formData).subscribe(
      (res) => {
        console.log(res);
        this.repositoryService.saveApplicantSession(res);
        let errorMsg=document.getElementsByClassName("errorMsg")[0];
        errorMsg["style"].color="green";
        errorMsg.innerHTML="You have accpet this agreement, we will contect you later.";
        errorMsg["style"].display='block';
        this.window.location.reload();
      },
      (error)=>{
        console.log(error);
        let errorMsg=document.getElementsByClassName("errorMsg")[0];
        errorMsg.innerHTML="Sorry, something went wrong. Please try again later.";
        errorMsg["style"].display='block';
      }
    );
  }

  getDeviceInfo() {
    var browser = {
      versions:function(){ 
          var u = navigator.userAgent, app = navigator.appVersion; 
          return {
             trident: u.indexOf('Trident') > -1, //IE内核
             presto: u.indexOf('Presto') > -1, //opera内核
             webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
             gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
             mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
             ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
             android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
             iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone
             iPad: u.indexOf('iPad') > -1, //是否iPad
          };
      }(),
      language:(navigator.language).toLowerCase()
    };

    this.deviceInfos=new DeviceInfo("","");
    this.deviceInfos.browserType=this.getBrowserType();
    
    if( browser.versions.ios){
      this.deviceInfos.deviceType="IOS";
    }else if( browser.versions.iPhone ){
      this.deviceInfos.deviceType="iPhone";
    }else if( browser.versions.iPad ){
      this.deviceInfos.deviceType="iPad";
    }else if( browser.versions.android ){
      this.deviceInfos.deviceType="Android";
    }else{
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod","webOS","BlackBerry"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      if(flag){
        if(navigator.userAgent.indexOf("Mac OS")>0){
          this.deviceInfos.deviceType="Mac OS";
        }else if(navigator.userAgent.indexOf("Windows")>0){
          this.deviceInfos.deviceType="Windows";
        }else{
          this.deviceInfos.deviceType="PC";
        }
      }else{
        this.deviceInfos.deviceType="Mobile Device";
      }
    }
  }

  getBrowserType(): string {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1; //Opera
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //IE
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //IE Edge
    var isFF = userAgent.indexOf("Firefox") > -1; //Firefox
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //Safari
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //Chrome
    
    if (isIE){ 
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);"); 
      reIE.test(userAgent); 
      var fIEVersion = parseFloat(RegExp["$1"]); 
      if(fIEVersion == 7) 
      { return "IE7";} 
      else if(fIEVersion == 8) 
      { return "IE8";} 
      else if(fIEVersion == 9) 
      { return "IE9";} 
      else if(fIEVersion == 10) 
      { return "IE10";} 
      else if(fIEVersion == 11) 
      { return "IE11";} 
      else
      { return "0"}//IE版本过低 
    }//isIE end 
        
    if (isFF) { return "FF";} 
    if (isOpera) { return "Opera";} 
    if (isSafari) { return "Safari";} 
    if (isChrome) { return "Chrome";} 
    if (isEdge) { return "Edge";} 
  }
}

class DeviceInfo {
  browserType: string;
  deviceType: string;

  constructor(browserType: string, deviceType: string) {
    this.browserType = browserType;
    this.deviceType = deviceType;
  }
}
