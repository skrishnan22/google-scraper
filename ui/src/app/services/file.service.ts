import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private API_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { 

  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('keywordsFile', file, file.name);

    return this.http.post(`${this.API_URL}/file/upload`, formData);
  }

  pollUploadStatus(fileUploadId: string): Observable<any> {
    return interval(2000) // Polling every 2 seconds
      .pipe(
        switchMap(() => this.http.get(`${this.API_URL}/file/upload-status/${fileUploadId}`))
      );
  }
}
