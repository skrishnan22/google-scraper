import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginSubscription = this.userService.login(this.loginForm.value).subscribe({
        next: response => {
          if (response?.data?.user) {
            localStorage.setItem('token', response.data.user.token);
            localStorage.setItem('userName', response.data.user.name);
          }
          this.router.navigate(['/home']);
        },
        error: error => {
          this.toastService.showError(`Login Error - ${error?.error?.message}`, 5000);
        }
      });
      this.subscriptions.push(loginSubscription);
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private markFormFieldsAsTouched() {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
