import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isCollapsed = true;
  initial: String = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('userName');
    if (username) {
      const initial = username.replace(/[^a-zA-Z0-9 ]/g, '');
      this.initial = initial.substring(0, 2).toUpperCase();
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
