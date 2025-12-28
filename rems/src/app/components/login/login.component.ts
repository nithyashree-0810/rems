import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  login: Login = new Login();

  private readonly validEmail = 'admin@gmail.com';
  private readonly validPassword = 'admin123';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    document.body.classList.add('login-page');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-page');
  }

  onSubmit(form: NgForm): void {

    if (form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (
        this.login.email === this.validEmail &&
        this.login.password === this.validPassword
      ) {
        this.spinner.hide();
        this.toastr.success('Login Successful');
        this.router.navigate(['/dashboard']);
      } else {
        this.spinner.hide();
        this.toastr.error('Invalid Email or Password');
      }

    }, 1500);
  }
}
