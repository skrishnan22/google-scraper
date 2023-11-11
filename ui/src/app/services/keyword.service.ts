import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  private API_URL = 'http://localhost:5001';

  constructor(private httpClient: HttpClient) {}

  getKeywords(page: number, pageSize: number): Observable<any> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.httpClient.get(`${this.API_URL}/keyword`, { params });
  }
}
