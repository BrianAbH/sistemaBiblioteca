import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPrestamo } from '../../models/prestamos.model';

@Injectable({
  providedIn: 'root',
})
export class PrestamoServices {
  private urlApi = "https://localhost:7251/api/Prestamos";


  constructor(private http:HttpClient){}

  getPrestamos():Observable<IPrestamo[]>{
    return this.http.get<IPrestamo[]>(this.urlApi);
  }

  postPrestamo(prestamo:IPrestamo):Observable<IPrestamo>{
    return this.http.post<IPrestamo>(this.urlApi,prestamo);
  }

  putPrestamo(prestamo:IPrestamo):Observable<IPrestamo>{
    const url = `${this.urlApi}/${prestamo.id_prestamo}`
    return this.http.put<IPrestamo>(url,prestamo);
  }
  
  deletePrestamo(id:number):Observable<IPrestamo>{
    const url = `${this.urlApi}/${id}`
    return this.http.patch<IPrestamo>(url,{});
  }
}
