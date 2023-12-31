import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  signUp(userDetails: { name: string; password: string; email: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/user/sign-up`, userDetails);
  }

  login(loginDetails: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/user/login`, loginDetails);
  }
}
