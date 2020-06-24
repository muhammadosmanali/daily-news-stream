import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ManagementService } from '../management.service';
import { NewsModel } from '../news.model';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css'],
})
export class CreateNewsComponent implements OnInit, OnDestroy {
  editMode = false;
  selectedFile: File = null;
  fileName: string;
  isLoading = false;
  status = null;
  categoryList = [];

  @ViewChild('f', { static: false }) form: NgForm;
  imageUrl: string = '';
  category: string = '';
  language: string = '';
  newsSubject: string = '';
  date: Date;
  newsD1: string = '';
  newsD2: string = '';
  newsD3: string = '';

  private editNews: any = null;
  private data: NewsModel = null;
  private paramId: string;

  paramsSub: Subscription;
  paramQuerySub: Subscription;

  constructor(
    private managementService: ManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paramQuerySub = this.route.queryParams.subscribe(
      (queryParam: Params) => {
        this.editMode = queryParam['editMode'] === '1' ? true : false;
        if (this.editMode) {
          this.paramsSub = this.route.paramMap.subscribe((param: Params) => {
            this.paramId = param['params'].id;
            this.editNews = this.managementService.getNewsById(this.paramId);

            this.initEdit();
          });
        }
      }
    );
    this.managementService.getCategoryUpdatedListener().subscribe(resData => {
      this.categoryList = resData;
    });
    this.categoryList = this.managementService.getCategory();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
  }


  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;

    //Values of fields
    const imageUrl = this.form.value.imageUrl;
    const category = this.form.value.category;
    const newsSubject = this.form.value.newsSubject;
    const newsDetail1 = this.form.value.newsDetail1;
    const newsDetail2 = this.form.value.newsDetail2;
    const newsDetail3 = this.form.value.newsDetail3;
    const language = this.form.value.language;
    const views = 0;
    const date = this.form.value.date;
    //Converting date to string
    const nDate = this.formatAMPM(new Date(date));

    const news = new NewsModel(
      category,
      newsSubject,
      newsDetail1,
      newsDetail2,
      language,
      views,
      nDate,
      date,
      newsDetail3,
      imageUrl
    );
    if (!this.editMode) {
      if (this.selectedFile) {
        this.managementService.storeNews(
          news,
          this.selectedFile,
          this.fileName,
          true
        );
      } else {
        this.managementService.storeNews(
          news,
          this.selectedFile,
          this.fileName,
          false
        );
      }
    } else {
      this.managementService.UpdateNews(news, this.paramId);
    }

    let interval = setInterval(() => {
      if (this.managementService.CreateNewsStatus) {
        this.isLoading = false;
        this.fileName = '';
        this.form.reset();
        clearInterval(interval);
        this.status = 'News Added Successfully to the database.';
        setTimeout(() => {
          this.status = null;
        }, 4000);
      }
    }, 1000);
  }

  initEdit() {
    if (this.editMode && this.editNews.length > 0) {
      this.data = this.editNews[0][1];

      this.imageUrl = this.data.ImagePath;
      this.newsSubject = this.data.newsSubject;
      this.category = this.data.category;
      this.language = this.data.language;
      this.date = this.data.realDate;
      this.newsD1 = this.data.newsDetail1;
      this.newsD2 = this.data.newsDetail2;
      this.newsD3 = this.data.newsDetail3;
    } else if (this.editMode && this.editNews.length == 0) {
      this.isLoading = true;
      this.managementService
        .fetchSpecificNews(this.paramId)
        .subscribe((news) => {
          this.imageUrl = news.ImagePath;
          this.newsSubject = news.newsSubject;
          this.category = news.category;
          this.language = news.language;
          this.date = news.realDate;
          this.newsD1 = news.newsDetail1;
          this.newsD2 = news.newsDetail2;
          this.newsD3 = news.newsDetail3;
          this.isLoading = false;
        });
    }
  }

  close() {
    this.status = null;
  }

  formatAMPM(date: Date) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    let nminutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime =
      monthNames[month] +
      ' ' +
      day +
      ', ' +
      year +
      ' | ' +
      hours +
      ':' +
      nminutes +
      ' ' +
      ampm;
    return strTime;
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
    if (this.paramQuerySub) {
      this.paramQuerySub.unsubscribe();
    }
  }
}
