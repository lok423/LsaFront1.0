import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../services/servercalls/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'post-article',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  articleId: string;
  article: any;
  baseUrl="http://ls3.api2"
  postBody: any

  constructor(
    public communitySearchService: GeneralService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.articleId = this.route.snapshot.params['id'];
    this.communitySearchService.showPost(this.articleId).subscribe(
      (data)=>{
        console.log(data)
        this.article = data['data'].thisPost
        this.postBody = this.article.post_body_1
      },
      (error)=>{
        console.log(error)
      }
    )


  }
}
