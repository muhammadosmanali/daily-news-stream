import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ManagementService } from './management.service';

@Injectable({providedIn: 'root'})
export class NewsResolveService implements Resolve<any> {
  constructor(private managementService: ManagementService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const news = this.managementService.getNews();

    if(news.length === 0) {
      return this.managementService.fetchAllNews();
    } else {
      return news
    }
  }
}
