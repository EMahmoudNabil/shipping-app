import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  showPassword = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/dashboard']);
      console.log('Token found, redirecting to dashboard...');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('authToken', res.token);
          this.toastr.success(`مرحبًا ${res.fullName}!`, 'تم تسجيل الدخول بنجاح');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('لم يتم استلام رمز المصادقة.', 'خطأ');
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'فشل في تسجيل الدخول', 'خطأ');
        this.loading = false;
      },
    });
  }
}
