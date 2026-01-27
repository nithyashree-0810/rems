import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent {
    user = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            this.toastr.warning('Please fill all fields correctly');
            return;
        }

        if (this.user.password !== this.user.confirmPassword) {
            this.toastr.error('Passwords do not match');
            return;
        }

        this.loading = true;
        this.authService.register({
            fullName: this.user.fullName,
            email: this.user.email,
            password: this.user.password
        }).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.loading = false;
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.toastr.error(err.error.error || 'Registration failed');
                this.loading = false;
            }
        });
    }
}
