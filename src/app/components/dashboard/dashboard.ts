import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UsuariosServices } from '../../services/usuarios/usuarios.services';
import { IUsuarios } from '../../models/usuarios.model';
import { LibrosServices } from '../../services/libros/libros.services';
import { ILibros } from '../../models/libros.model';
import { PrestamoServices } from '../../services/prestamos/prestamo.services';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  usuarios:IUsuarios[] = [];
  libros:ILibros[] = [];
  prestamos:any[] = [];

  constructor(private auth: AuthService, private srv_usuarios: UsuariosServices, private srv_libros:LibrosServices, private srv_prestamos:PrestamoServices) {
    this.Usuarios();
    this.Libros();
    this.Prestamos();
  }

  Usuarios(){
    this.srv_usuarios.getUsuarios().subscribe(
      (data : IUsuarios[])=>{
        this.usuarios = data;
      }
    );
  }

  Libros(){
    this.srv_libros.getLibros().subscribe(
      (data : ILibros[])=>{
        this.libros = data;
      }
    );
  }

  Prestamos(){
    this.srv_prestamos.getPrestamosActivos().subscribe(
      (data : any[])=>{
        this.prestamos = data;
      }
    );
  }
  


}
