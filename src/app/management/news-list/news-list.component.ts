import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManagementService } from '../management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsListComponent implements OnInit, OnDestroy {
  news: any;
  totalRecords: number;
  page: number = 1;
  isLoading = false;

  subscription: Subscription;

  constructor(private managementService: ManagementService) { }

  ngOnInit(): void {
    this.subscription = this.managementService.getNewsUpdateListener().subscribe(newsData => {
      this.news = newsData;
      this.isLoading = false;
    });
    this.news = this.managementService.getNews();
  }

  onRefresh() {
    this.isLoading = true;
    this.managementService.fetchAllNews();
    let interval = setInterval(() => {
      if(this.managementService.newsListStatus) {
        this.isLoading = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
