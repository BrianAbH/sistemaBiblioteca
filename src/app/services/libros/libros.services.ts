import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILibros } from '../../models/libros.model';

@Injectable({
  providedIn: 'root',
})
export class LibrosServices {

  private urlApi = "https://localhost:7251/api/Libros";

  constructor(private http:HttpClient){}


  getLibros():Observable<ILibros[]>{
    return this.http.get<ILibros[]>(`${this.urlApi}`);
  }

  getLibrosD():Observable<ILibros[]>{
    return this.http.get<ILibros[]>(`${this.urlApi}/disponibles/`);
  }

  postLibro(libro:ILibros):Observable<ILibros>{
    return this.http.post<ILibros>(this.urlApi,libro);
  }

  updateLibro(libro:ILibros):Observable<ILibros>{
    const urlActualizar = `${this.urlApi}/${libro.id_libro}`;
    return this.http.put<ILibros>(urlActualizar,libro);
  }

  deleteLibro(id:number){
    const url = `${this.urlApi}/${id}`;
    return this.http.patch<ILibros>(url,{});
  }

}
