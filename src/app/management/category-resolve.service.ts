import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ManagementService } from './management.service';

@Injectable({providedIn: 'root'})
export class CategoryResolveService implements Resolve<any> {
  constructor(private managementService: ManagementService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const category = this.managementService.getCategory();

    if(category.length === 0) {
      return this.managementService.fetchAllCategory();
    } else {
      return category
    }
  }
}
