import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login: Login = new Login();

  private readonly validEmail = 'admin@gmail.com';
  private readonly validPassword = 'admin123';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  onSubmit(form: NgForm) {

    this.spinner.show(); // Show loading

    setTimeout(() => { // simulate server delay

      if (this.login.email === this.validEmail && this.login.password === this.validPassword) {
        
        this.toastr.success('Login Successful');
        this.spinner.hide();

        this.router.navigate(['/dashboard']);

      } else {

        this.toastr.error('Invalid Email or Password');
        this.spinner.hide();
      }

    }, 1500); // 1.5 sec loading effect
  }
}
