import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  private API_URL = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {}

  getKeywords(page: number, pageSize: number, searchText: string): Observable<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString(), searchText };
    return this.httpClient.get(`${this.API_URL}/keyword`, { params });
  }

  getKeywordById(keywordId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/keyword/${keywordId}`);
  }
}
