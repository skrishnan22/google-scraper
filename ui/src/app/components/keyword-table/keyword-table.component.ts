import { Component, OnDestroy, OnInit } from '@angular/core';
import * as numeral from 'numeral';

import { KeywordService } from 'src/app/services/keyword.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-keyword-table',
  templateUrl: './keyword-table.component.html',
  styleUrls: ['./keyword-table.component.scss']
})
export class KeywordTableComponent implements OnInit, OnDestroy {
  keywords: any = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  private searchTerms = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private keywordService: KeywordService) {
    const searchSubscription = this.searchTerms
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query: any) => {
        this.currentPage = 1;
        this.loadKeywords(this.currentPage, query?.target?.value);
      });
    this.subscriptions.push(searchSubscription);
  }

  ngOnInit() {
    this.loadKeywords(this.currentPage);
  }

  loadKeywords(page: number, searchText: string = '') {
    const getKeywordSubscription = this.keywordService.getKeywords(page, this.pageSize, searchText).subscribe(data => {
      this.keywords = data?.data?.keywords;
      this.keywords = this.keywords.map((keyword: any) => {
        keyword.resultCount = numeral(keyword.resultCount).format('0.00 a');
        return keyword;
      });
      this.totalItems = data?.data?.totalCount;
    });
    this.subscriptions.push(getKeywordSubscription);
  }

  onPageChange(page: number) {
    this.loadKeywords(page);
  }

  searchKeywords(term: any): void {
    this.searchTerms.next(term);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openHtml(keywordId: string) {
    window.open(`/view-html/${keywordId}`, '_blank');
  }
}
