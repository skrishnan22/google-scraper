import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signupSubscription = this.userService.signUp(this.signupForm.value).subscribe({
        next: response => {
          if (response?.data?.user?.token) {
            localStorage.setItem('token', response.data.user.token);
            localStorage.setItem('userName', response.data.user.name);
          }
          this.router.navigate(['/home']);
        },
        error: error => {
          this.toastService.showError(`Error during Sign up ${error?.error?.message}`, 5000);
        }
      });
      this.subscriptions.push(signupSubscription);
    } else {
      this.markFormFieldsAsTouched();
    }
  }
  get form() {
    return this.signupForm.controls;
  }

  private markFormFieldsAsTouched() {
    Object.keys(this.signupForm.controls).forEach(field => {
      const control = this.signupForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
