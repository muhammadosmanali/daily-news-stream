import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { NgxPaginationModule } from 'ngx-pagination';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './body/home/home.component';
import { ManagementComponent } from './management/management.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { CreateNewsComponent } from './management/create-news/create-news.component';
import { NewsListComponent } from './management/news-list/news-list.component';
import { CategoryComponent } from './management/category/category.component';
import { CovidComponent } from './body/home/covid/covid.component';
import { LatestNewsComponent } from './body/home/latest-news/latest-news.component';
import { NewsDetailComponent } from './shared/news-detail/news-detail.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { NewsItemComponent } from './management/news-list/news-item/news-item.component';
import { DetailComponent } from './management/news-list/detail/detail.component';
import { ImageViewComponent } from './shared/image-view/image-view.component';
import { CategoryNewsListComponent } from './body/category-news-list/category-news-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    HomeComponent,
    ManagementComponent,
    LoadingSpinnerComponent,
    CreateNewsComponent,
    NewsListComponent,
    CategoryComponent,
    CovidComponent,
    LatestNewsComponent,
    NewsDetailComponent,
    PageNotFoundComponent,
    NewsItemComponent,
    DetailComponent,
    ImageViewComponent,
    CategoryNewsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
