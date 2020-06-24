import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ManagementService } from '../../management.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.css'],
})
export class NewsItemComponent implements OnInit {
  @Input() newsItem: any;
  detailStatus = false;
  deleteStatus = false;

  constructor(
    private managementService: ManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onDelete(id: string, downloadUrl: string) {
    this.managementService.deleteNews(id);
    this.managementService.deleteImage(downloadUrl);
  }

  clickDelete() {
    this.deleteStatus = true;
  }

  onCancel() {
    this.deleteStatus = false;
  }

  onDetail() {
    this.detailStatus = true;
  }

  onEdit(id) {
    this.router.navigate(['/management/edit', id], {queryParams: {'editMode': 1}});
  }

  onClose() {
    this.detailStatus = false;
    this.deleteStatus = false;
  }
}
