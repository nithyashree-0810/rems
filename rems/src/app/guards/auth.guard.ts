import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<UrlTree | boolean> | Promise<UrlTree | boolean> | UrlTree | boolean {

        if (!this.authService.isTokenExpired()) {
            return true;
        }

        // Token is missing or expired
        localStorage.removeItem('token');
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
