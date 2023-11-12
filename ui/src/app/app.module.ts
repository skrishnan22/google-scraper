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

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
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
    HomeComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    NgbModule, 
    NgbToastModule, 
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule {}
