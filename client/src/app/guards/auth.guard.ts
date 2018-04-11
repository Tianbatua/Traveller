import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  // store the URL so we can redirect after logging in
  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Check if user is authorized to view route
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) {
    if(!this.authService.loggedInExpired()){
      return true;
    }else{
      this.redirectUrl = state.url; // Store the attempted URL for redirecting
      this.router.navigate(['/login']); // Navigate to the login page with extras
      return false;
    }
  }
}