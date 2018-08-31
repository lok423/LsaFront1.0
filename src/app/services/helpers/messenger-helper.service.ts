import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class MessengerHelperService {
  ha = 123;
  trigger = new BehaviorSubject<any>('no');
  constructor() { }
}
