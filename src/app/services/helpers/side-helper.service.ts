import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromEvent';

@Injectable({
  providedIn: 'root'
})
export class SideHelperService {
  helperMatch = new BehaviorSubject<any>('');
  helperMatchObv:Observable<any>

  constructor() {
    this.helperMatchObv = this.helperMatch.asObservable();
  }

  sendMessage(val: string): void {
    this.helperMatch.next(val);
  }

  getObservableMessage() {
    return this.helperMatchObv;
  }
  
}
