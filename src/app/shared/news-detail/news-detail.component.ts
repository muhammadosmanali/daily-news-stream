import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/management/management.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css'],
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  onlyNews: any;
  relatedNews: any;
  isLoading = false;
  isLoadingOtherNews = false;

  paramSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managementService: ManagementService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingOtherNews = true;
    this.paramSub = this.route.params.subscribe((param: Params) => {
      let specificNews = this.managementService.getNewsById(param.id);
      if (specificNews.length > 0) {
        this.onlyNews = specificNews[0][1];
        window.scrollTo(0, 0);
        this.isLoading = false;
        const category = specificNews[0][1]['category'];
        const categoryRelatedNews = this.managementService.getNewsByCategory(
          category
        );
        this.relatedNews = categoryRelatedNews.filter(news => news[0] !== param.id);
        this.isLoadingOtherNews = false;
      } else {
        this.managementService
          .fetchSpecificNews(param.id)
          .subscribe((resData) => {
            if (resData == null) {
              this.router.navigate(['not-found'], { relativeTo: this.route });
              this.isLoading = false;
            } else {
              this.onlyNews = resData;
              const category = resData.category;
              this.managementService
                .fetchAllNewsOrderby('category', category)
                .subscribe((resData) => {
                  this.relatedNews = Object.entries(resData);
                  this.relatedNews = this.relatedNews.filter(news => news[0] !== param.id);
                  this.isLoadingOtherNews = false;
                });
              this.isLoading = false;
            }
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}
