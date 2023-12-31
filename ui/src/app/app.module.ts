import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ProgressModalComponent } from './components/progress-modal/progress-modal.component';
import { NgbModule, NgbActiveModal, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { KeywordTableComponent } from './components/keyword-table/keyword-table.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthResponseInterceptor } from './auth-response.interceptor';
import { ViewHtmlComponent } from './components/view-html/view-html.component';
const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'view-html/:keywordId', component: ViewHtmlComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FileUploadComponent,
    ProgressModalComponent,
    KeywordTableComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    ViewHtmlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    NgbToastModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [
    NgbActiveModal,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthResponseInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
