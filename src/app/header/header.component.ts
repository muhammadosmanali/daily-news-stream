import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ManagementService } from '../management/management.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isNavbar = false;
  isDropdown = false;
  isAuthenticated = false;

  categoryList;

  private userSubscription: Subscription;
  private categorySub: Subscription;

  constructor(
    private authService: AuthService,
    private managementService: ManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.categorySub = this.managementService
      .getCategoryUpdatedListener()
      .subscribe((resData) => {
        this.categoryList = resData;
      });
  }

  onMenu() {
    this.isNavbar = !this.isNavbar;
  }

  onDropdown() {
    this.isDropdown = !this.isDropdown;
  }

  onCategoryClick(category) {
    this.router.navigate(['category', category], {relativeTo: this.route});
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
  }

  onLogut() {
    this.authService.logout();
  }
}
