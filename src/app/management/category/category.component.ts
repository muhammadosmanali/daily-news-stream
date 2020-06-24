import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManagementService } from '../management.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryList;

  subscription: Subscription;

  constructor(private managementService: ManagementService) { }

  ngOnInit(): void {
    this.subscription = this.managementService.getCategoryUpdatedListener().subscribe((resData) => {
      this.categoryList = resData;
    });
    this.categoryList = this.managementService.getCategory();
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const category = form.value.category;
    this.managementService.storeCategory(category);
    form.reset();
  }

  onDelete(id: string) {
    this.managementService.deleteCategory(id);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
