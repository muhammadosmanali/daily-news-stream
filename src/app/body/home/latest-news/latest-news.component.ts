import { Component, OnInit, OnDestroy } from '@angular/core';
import * as AOS from 'aos';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/management/management.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.css'],
})
export class LatestNewsComponent implements OnInit, OnDestroy {
  categoryList: any;
  newsList = [];
  filteredNews = [];

  isActive = false;
  isLoading = false;
  imageLoading = true;

  currentCategory = 'Latest';

  categorySub: Subscription;
  newsSub: Subscription;

  constructor(
    private managementService: ManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Animate on scroll
    AOS.init();

    this.isLoading = true;
    //Getting news data
    this.newsSub = this.managementService
      .getNewsUpdateListener()
      .subscribe((resData) => {
        this.newsList = resData;
      });
    this.newsList = this.managementService.getNews();

    let interval = setInterval(() => {
      if (this.newsList.length > 0) {
        //Filter the news
        this.filteredNews = this.newsList.filter(
          (news) => news[1].category === this.currentCategory
        );
        this.isLoading = false;
        clearInterval(interval);
      }
    }, 500);

    //Getting category data
    this.categorySub = this.managementService
      .getCategoryUpdatedListener()
      .subscribe((resData) => {
        this.categoryList = resData;
      });
    this.categoryList = this.managementService.getCategory();
  }

  onNewsClick(id) {
    this.router.navigate(['news', id], {relativeTo: this.route});
  }

  onDropdown() {
    this.isActive = !this.isActive;
  }

  onImageLoad() {
    this.imageLoading = false;
  }

  onSelectCategory(category) {
    this.currentCategory = category;
    this.filteredNews = this.newsList.filter(
      (news) => news[1].category === this.currentCategory
    );
  }

  ngOnDestroy() {
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
  }
}
