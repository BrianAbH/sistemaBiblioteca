import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = "https://localhost:7251/api/Auth";
  private tokenKey = 'token';


  constructor(private http: HttpClient, private router: Router) {}


  login(correo: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { correo, password });
  }


  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    alert("Sesión Cerrada")
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['role'] || null; //Porque ClaimTypes.Role se serializa como role en el JWT
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['id_user'] || null; //Porque ClaimTypes.Role se serializa como role en el JWT
  }


  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['username'] || null; 
  }

  getUserCorreo(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['correo'] || null; //Porque ClaimTypes.Role se serializa como role en el JWT
  }
}
