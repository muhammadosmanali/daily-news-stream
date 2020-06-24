import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NewsModel } from './news.model';
import { take, exhaustMap } from 'rxjs/operators';
import { Subject, concat } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({ providedIn: 'root' })
export class ManagementService {
  newsUpdated = new Subject<any>();
  private news = [];

  categoryUpdated = new Subject<any>();
  private category = [];

  public CreateNewsStatus: boolean = false;
  public newsListStatus: boolean = false;
  public footerStatus: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {}

  //MANAGE NEWS ARRAY
  getNewsUpdateListener() {
    return this.newsUpdated.asObservable();
  }

  getNews() {
    return this.news;
  }

  getNewsById(id: string) {
    const news = this.news.filter((n) => n[0] === id);
    return news;
  }

  getNewsByCategory(category: string) {
    const news = this.news.filter((n) => n[1].category === category);
    return news;
  }

  updateItemByIndex(index: number, updatedItem: any) {
    this.news[index] = updatedItem;
    this.newsUpdated.next(this.news);
  }

  //NEWS
  //WRITE OPERATIONS

  //POST NEWS
  //DONE
  storeNews(
    news: NewsModel,
    file: File,
    fileName: string,
    imageStatus: boolean
  ) {
    let userId = null;
    this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          userId = user.id;
          return this.http.post(
            `https://daily-news-stream.firebaseio.com/news.json`,
            news,
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        })
      )
      .subscribe((newsId) => {
        const uniqueId = newsId['name'];

        this.fetchSpecificNews(newsId['name']).subscribe((resData) => {
          const specificNews = [newsId['name'], resData];
          this.news.push(specificNews);
          this.newsUpdated.next(this.news);
          if (imageStatus) {
            this.UploadImage(uniqueId, file, fileName, userId);
          } else {
            this.CreateNewsStatus = true;
          }
        });
      });
  }

  //UPLOAD IMAGE TO FIREBASE
  //DONE
  UploadImage(uniqueId: string, file: File, fileName: string, userId: string) {
    const extension = fileName.split('.').pop();
    const newFileName = uniqueId + '.' + extension;
    const metaData = { contentType: file.type };

    const storageRef: firebase.storage.Reference = firebase
      .storage()
      .ref(`/user/${userId}/${newFileName}`);

    const uploadTask: firebase.storage.UploadTask = storageRef.put(
      file,
      metaData
    );

    console.log('Uploading: ', fileName);
    return uploadTask.then(
      (uploadSnapShot: firebase.storage.UploadTaskSnapshot) => {
        console.log('upload is complete');
        uploadSnapShot.ref.getDownloadURL().then((url) => {
          this.imagePathUpdate(url, uniqueId).subscribe((resData) => {
            this.CreateNewsStatus = true;
          });
        });
      }
    );
  }

  //UPDATE NEWS
  UpdateNews(news: NewsModel, id: string) {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          return this.http.put(
            `https://daily-news-stream.firebaseio.com/news/${id}.json`,
            news,
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        })
      )
      .subscribe((resData) => {
        const news = this.news.filter((n) => n[0] == id);
        const index = this.news.indexOf(news);
        const updatedNews = [id, resData];
        console.log(updatedNews);
        this.updateItemByIndex(index, updatedNews);
        this.CreateNewsStatus = true;
      });
  }

  //INCREMENT IN VIEWS
  incrementView(views: number, id: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.patch(
          `https://daily-news-stream.firebaseio.com/news/${id}.json`,
          {
            views: views,
          },
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      })
    );
  }

  //UPDATE THE IMAGE PATH
  //DONE
  imagePathUpdate(ImagePath: string, id: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.patch(
          `https://daily-news-stream.firebaseio.com/news/${id}.json`,
          {
            ImagePath: ImagePath,
          },
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      })
    );
  }

  //DELETE IMAGE
  //DONE
  deleteImage(downloadUrl: string) {
    const storageRef: firebase.storage.Reference = firebase
      .storage()
      .refFromURL(downloadUrl);
    return storageRef.delete().then((res) => {
      console.log(res);
    });
  }

  //DELETE THE NEWS
  deleteNews(id: string) {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          return this.http.delete(
            `https://daily-news-stream.firebaseio.com/news/${id}.json`,
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        })
      )
      .subscribe(() => {
        const updatedNews = this.news.filter((news) => news[0] !== id);
        this.news = updatedNews;
        this.newsUpdated.next(this.news);
      });
  }

  //READ OPERATIONS

  //FETCH ALL THE NEWSES
  fetchAllNews() {
    return this.http
      .get('https://daily-news-stream.firebaseio.com/news.json')
      .subscribe((resData) => {
        let newsData = Object.entries(resData);
        this.news = newsData;
        this.newsUpdated.next(this.news);
        this.newsListStatus = true;
      });
  }

  fetchAllNewsOrderby(orderBy, category) {
    return this.http.get(
      'https://daily-news-stream.firebaseio.com/news.json?orderBy="' + orderBy + '"&startAt="' + category + '"&endAt="' + category + '"'
    );
  }

  //FETCH SINGLE NEWS BY ID
  fetchSpecificNews(id: string) {
    return this.http.get<NewsModel>(
      `https://daily-news-stream.firebaseio.com/news/${id}.json`
    );
  }

  //CATEGORY
  //MANAGE CATEGORY ARRAY
  getCategoryUpdatedListener() {
    return this.categoryUpdated.asObservable();
  }

  getCategory() {
    return this.category;
  }

  //CATEGORY
  //WRITE OPERATIONS

  //STORE CATEGORY
  storeCategory(category: string) {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          return this.http.post(
            'https://daily-news-stream.firebaseio.com/category.json',
            { category },
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        })
      )
      .subscribe((resData) => {
        const newData = [resData['name'], { category: category }];
        this.category.push(newData);
        this.categoryUpdated.next(this.category);
        console.log(newData);
      });
  }

  deleteCategory(id: string) {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          return this.http.delete(
            `https://daily-news-stream.firebaseio.com/category/${id}.json`,
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        })
      )
      .subscribe(() => {
        const updatedCategory = this.category.filter((c) => c[0] !== id);
        this.category = updatedCategory;
        this.categoryUpdated.next(this.category);
        console.log('delete success');
      });
  }

  //READ OPERATIONS

  //FETCH CATEGORY
  fetchAllCategory() {
    return this.http
      .get('https://daily-news-stream.firebaseio.com/category.json')
      .subscribe((resData) => {
        const obj = Object.entries(resData);
        this.category = obj;
        this.categoryUpdated.next(this.category);
      });
  }
}
