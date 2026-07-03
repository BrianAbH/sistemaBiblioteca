import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userCorreo = this.authService.getUserCorreo();
    
/*  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  


if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    alert('Acceso denegado: tu rol no tiene permiso.');
    this.router.navigate(['/inicio']);
    return false;
  }*/
    return true;
  }
}
