import { Component, OnInit } from '@angular/core';
import { KeywordService } from 'src/app/services/keyword.service';

@Component({
  selector: 'app-keyword-table',
  templateUrl: './keyword-table.component.html',
  styleUrls: ['./keyword-table.component.scss']
})
export class KeywordTableComponent implements OnInit {
  keywords: any = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  constructor(private keywordService: KeywordService) {}

  ngOnInit() {
    this.loadKeywords(this.currentPage);
  }

  loadKeywords(page: number) {
    this.keywordService.getKeywords(page, this.pageSize).subscribe(data => {
      this.keywords = data?.data?.keywords;
      this.totalItems = data?.data?.totalCount;
    });
  }

  onPageChange(page: number) {
    this.loadKeywords(page);
  }
}
