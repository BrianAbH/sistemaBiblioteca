import { Pipe, PipeTransform } from '@angular/core';
import { ICategorias } from '../models/categorias.model';
import { ILibros } from '../models/libros.model';
import { IUsuarios } from '../models/usuarios.model';



@Pipe({
  name: 'filtrarUsuarios'
})

export class filtroUsuario implements PipeTransform {
  transform(lista: any[], filtro: string, usuarios:IUsuarios[]): any[] {
    if (!filtro) return lista;

    filtro = filtro.toLowerCase();
    return usuarios.filter(item =>
        item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)||
        item.correo.includes(filtro)||
        item.telefono.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)
      );
  }
}

@Pipe({
  name: 'filtrar'
})

export class filtroLibro implements PipeTransform {
  transform(lista: any[], libro:ILibros[], filtro: string, categorias?:ICategorias[]|undefined): any[] {
    if (!filtro) return lista;

    filtro = filtro.toLowerCase();
    return libro.filter(item =>{
      categorias?.find(c => c.id_categoria == item.id_categoria)?.nombre_categoria?.toLowerCase() ?? ""
      return (
        item.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)||
        item.isbn.includes(filtro)||
        item.autor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)
      );
    });
  }
}


@Pipe({
  name: 'filtrarCategorias'
})

export class filtroCategorias implements PipeTransform {
  transform(lista: any[],filtro: string, categorias:ICategorias[]): any[] {
    if (!filtro) return lista;

    filtro = filtro.toLowerCase();
    return categorias.filter(item =>
        item.nombre_categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)
      );
    
  }
}

