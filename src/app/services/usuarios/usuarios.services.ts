import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuarios } from '../../models/usuarios.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosServices {
  private urlApi = "https://localhost:7251/api/Usuarios";


  constructor(private http: HttpClient){}


  getUsuarios() : Observable<IUsuarios[]>{
    return this.http.get<IUsuarios[]>(`${this.urlApi}`);
  }


  postUsuario(usuarios:IUsuarios) : Observable<IUsuarios>{
    return this.http.post<IUsuarios>(this.urlApi,usuarios);
  }

  updateUsuario(usuario:IUsuarios):Observable<IUsuarios>{
    const url = `${this.urlApi}/${usuario.id_usuario}`;
    return this.http.put<IUsuarios>(url,usuario);
  }

  delete(id:number):Observable<IUsuarios>{
    const url = `${this.urlApi}/${id}`;
    return this.http.patch<IUsuarios>(url,{});
  }
  

}
