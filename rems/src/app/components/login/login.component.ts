import { Component, OnDestroy, OnInit } from '@angular/core';
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

  particles: Array<{ top: number; left: number; delay: number }> = [];

  private readonly validEmail = 'admin@gmail.com';
  private readonly validPassword = 'admin123';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.generateParticles();
  }

  // ✨ Floating Glow Particles
  generateParticles(): void {
    this.particles = Array.from({ length: 40 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4
    }));
  }

  // ✅ Login Handler
  onSubmit(form: NgForm): void {

    if (form.invalid) {
      this.toastr.warning('Please enter email & password');
      return;
    }

    this.spinner.show();

    setTimeout(() => {
      if (
        this.login.email === this.validEmail &&
        this.login.password === this.validPassword
      ) {
        this.toastr.success('Login Successful');
        this.spinner.hide();
        this.router.navigate(['/dashboard']);
      } 
      else {
        this.toastr.error('Invalid Email or Password');
        this.spinner.hide();
      }
    }, 1200);
  }

  ngOnDestroy(): void {
    // nothing to clean now — safe component 👍
  }
}
