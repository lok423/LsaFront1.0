import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/security/auth.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-discussions-search',
  templateUrl: './discussions-search.component.html',
  styleUrls: ['./discussions-search.component.css']
})
export class DiscussionsSearchComponent implements OnInit {
  user=false;
  // discussions:any;
  // errorMessage:string;

  constructor(
    private auth: AuthService, 
    private meta: Meta,
    private titleService: Title,
  ) {
    if(this.auth.getUserRole()){
      this.user=true;}
      this.meta.addTags([
        { name: 'keywords', content: 'Community, Learnspace, tutoring, discussions, resources'},
        { name: 'description', content: 'Learnspace community discussions' },
      ])
      this.titleService.setTitle('Learnspace | Discussions');
   }

  ngOnInit() {
  }

}