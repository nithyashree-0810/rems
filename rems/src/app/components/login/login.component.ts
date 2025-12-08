import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login:Login = new Login();

  private readonly validEmail = 'admin@gmail.com';
  private readonly validPassword = 'admin123';

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    if (this.login.email === this.validEmail && this.login.password === this.validPassword) {
      alert('Login Successfully!');
      this.router.navigate(['/dashboard']); // redirect after success
    } else {
      alert(' Invalid Email or Password');
    }
  }

}
