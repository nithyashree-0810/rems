import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false
})
export class ForgotPasswordComponent {
    email = '';
    otp = '';
    newPassword = '';
    stage = 1; // 1: Email, 2: OTP & New Password
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    sendOtp(form: NgForm) {
        if (form.invalid) {
            this.toastr.warning('Please enter a valid email');
            return;
        }

        this.loading = true;
        this.authService.sendOtp(this.email).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.stage = 2;
                this.loading = false;
            },
            error: (err) => {
                this.toastr.error(err.error.error || 'Failed to send OTP');
                this.loading = false;
            }
        });
    }

    resetPassword(form: NgForm) {
        if (form.invalid) {
            this.toastr.warning('Please fill all fields correctly');
            return;
        }

        this.loading = true;
        this.authService.resetPassword({
            email: this.email,
            otp: this.otp,
            newPassword: this.newPassword
        }).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.loading = false;
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.toastr.error(err.error.error || 'Reset failed');
                this.loading = false;
            }
        });
    }
}
