import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './body/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ManagementComponent } from './management/management.component';
import { AuthGuard } from './auth/auth.guard';
import { NewsDetailComponent } from './shared/news-detail/news-detail.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { NoAuthGuard } from './auth/noauth.guard';
import { CreateNewsComponent } from './management/create-news/create-news.component';
import { NewsListComponent } from './management/news-list/news-list.component';
import { CategoryComponent } from './management/category/category.component';
import { NewsResolveService } from './management/news-resolve.service';
import { CategoryResolveService } from './management/category-resolve.service';
import { CategoryNewsListComponent } from './body/category-news-list/category-news-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: [CategoryResolveService, NewsResolveService],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    resolve: [CategoryResolveService],
  },
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [AuthGuard],
    resolve: [CategoryResolveService],
    children: [
      { path: '', redirectTo: '/management/news-list', pathMatch: 'full' },
      { path: 'create-news', component: CreateNewsComponent },
      { path: 'edit/:id', component: CreateNewsComponent },
      {
        path: 'news-list',
        component: NewsListComponent,
        resolve: [NewsResolveService],
      },
      { path: 'category', component: CategoryComponent },
    ],
  },
  {
    path: 'news/:id',
    component: NewsDetailComponent,
    resolve: [CategoryResolveService],
  },
  { path: 'category/:name', component: CategoryNewsListComponent, resolve: [CategoryResolveService, NewsResolveService] },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
