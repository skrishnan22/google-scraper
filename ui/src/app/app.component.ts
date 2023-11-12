import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Google Scraper';
  constructor(public toastService: ToastService, private titleService: Title){
  }

  ngOnInit() {
    this.titleService.setTitle('Google Scraper');
  }
}
