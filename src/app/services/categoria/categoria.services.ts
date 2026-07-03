import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICategorias } from '../../models/categorias.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriasServices {
  private urlApi = "https://localhost:7251/api/Categorias";

  constructor(private http:HttpClient){}

  getCategorias():Observable<ICategorias[]>{
    return this.http.get<ICategorias[]>(`${this.urlApi}`);
  }

  postCategoria(categoria:ICategorias):Observable<ICategorias>{
    return this.http.post<ICategorias>(this.urlApi, categoria);
  }

  putCategoria(categoria:ICategorias):Observable<ICategorias>{
    const urlActualizar = `${this.urlApi}/${categoria.id_categoria}`;

    return this.http.put<ICategorias>(urlActualizar,categoria);
  }

}
