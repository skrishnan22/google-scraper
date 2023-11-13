import { Component, OnInit } from '@angular/core';
import * as numeral from 'numeral';

import { KeywordService } from 'src/app/services/keyword.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  private searchTerms = new Subject<string>();

  constructor(private keywordService: KeywordService) {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()).subscribe((query: any) => {
      this.currentPage = 1;
      this.loadKeywords(this.currentPage, query?.target?.value);
    });
  }

  ngOnInit() {
    this.loadKeywords(this.currentPage);
  }

  loadKeywords(page: number, searchText: string = '') {
    this.keywordService.getKeywords(page, this.pageSize, searchText).subscribe(data => {
      this.keywords = data?.data?.keywords;
      this.keywords = this.keywords.map((keyword: any) => {
        keyword.resultCount = numeral(keyword.resultCount).format('0.00 a');
        return keyword;
      });
      this.totalItems = data?.data?.totalCount;
    });
  }

  onPageChange(page: number) {
    this.loadKeywords(page);
  }

  searchKeywords(term: any): void {
    this.searchTerms.next(term);
  }
}
