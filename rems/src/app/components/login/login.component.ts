import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  login: Login = new Login();
  isLoginMode: boolean = true;

  registerUser = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    document.body.classList.add('login-page');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-page');
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.spinner.show();
    this.authService.login({
      email: this.login.email,
      password: this.login.password
    }).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success('Login Successful');
        localStorage.setItem('token', res.token);
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('fullName', res.fullName);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error || 'Invalid Email or Password');
      }
    });
  }

  onRegisterSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.warning('Please fill all fields correctly');
      return;
    }

    if (this.registerUser.password !== this.registerUser.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.spinner.show();
    this.authService.register({
      fullName: this.registerUser.fullName,
      email: this.registerUser.email,
      password: this.registerUser.password
    }).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.spinner.hide();
        this.isLoginMode = true; // Switch to login after success
      },
      error: (err) => {
        this.toastr.error(err.error.error || 'Registration failed');
        this.spinner.hide();
      }
    });
  }
}
