import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../services/servercalls/general.service';
import { AuthService } from '../../../../services/security/auth.service';
import { environment } from '../../../../../environments/environment.prod';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-posts-search',
  templateUrl: './posts-search.component.html',
  styleUrls: ['./posts-search.component.css']
})
export class PostsSearchComponent implements OnInit {
  errorMessage: string;
  articles:any;
  user:number;
  authorPic:string
  postPic:string
  baseImgUrl = environment.baseImgUrl;
  type:string
  subject:string
  grade:string

  constructor(
    public communitySearchService: GeneralService,
    private auth: AuthService, 
    private meta: Meta,
    private titleService: Title,
  ) {
    this.meta.addTags([
      { name: 'keywords', content: 'community, Learnspace, tutoring, articles, posts, resources'},
      { name: 'description', content: 'Learnspace posts' },
    ])
    this.titleService.setTitle('Learnspace | Posts');
    
    if(this.auth.getUserRole()==3){
      this.user = 3;}
   }

  ngOnInit() {
    
    this.communitySearchService.indexAllPosts(this.type, this.subject, this.grade).subscribe(
      (data)=>{
        console.log(data)
        this.articles = data['data']
      },
      (error)=>{
        this.errorMessage="Something went horribly wrong."
        console.log(error)
      }
    )
  }

}
