import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManagementService } from 'src/app/management/management.service';
import { Subscription } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-category-news-list',
  templateUrl: './category-news-list.component.html',
  styleUrls: ['./category-news-list.component.css'],
})
export class CategoryNewsListComponent implements OnInit, OnDestroy {
  newsListByCategory = [];
  isLoading = false;
  currentCategory;
  news = [];

  paramSub: Subscription;
  newsParam: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managementService: ManagementService
  ) {}

  ngOnInit(): void {
    AOS.init();

    this.isLoading = true;

    this.paramSub = this.route.params.subscribe((param: Params) => {
      this.newsParam = this.managementService
        .getNewsUpdateListener()
        .subscribe((resData) => {
          this.news = resData;
        });
      this.news = this.managementService.getNews();

      let interval = setInterval(() => {
        if (this.news.length > 0) {
          this.currentCategory = param.name;
          this.newsListByCategory = this.news.filter(
            (n) => n[1].category === param.name
          );
          this.isLoading = false;
          clearInterval(interval);
        }
      }, 500);
    });
  }

  onNewsClick(id) {
    this.router.navigate(['/news', id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.newsParam) {
      this.newsParam.unsubscribe();
    }
  }
}
