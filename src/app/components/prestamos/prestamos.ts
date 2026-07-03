import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { Search } from "../../shared/search/search";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsuarios } from '../../models/usuarios.model';
import { UsuariosServices } from '../../services/usuarios/usuarios.services';
import { LibrosServices } from '../../services/libros/libros.services';
import { ILibros } from '../../models/libros.model';
import { filtroUsuario, filtroLibro } from "../../pipes/filtros";
import { PrestamoServices } from '../../services/prestamos/prestamo.services';
import { IPrestamo } from '../../models/prestamos.model';

declare const bootstrap:any;

@Component({
  selector: 'app-prestamos',
  imports: [Search, ReactiveFormsModule, filtroUsuario, filtroLibro],
  templateUrl: './prestamos.html',
})
export class Prestamos {
  fechaActual = new Date();

  estados:string[]=["En prestamo","Devuelto","Vencido"];
  isEditing:number|null = null;
  
  formPrestamo:FormGroup;
  usuarios:IUsuarios[]=[];
  libros:ILibros[]=[];
  prestamos:IPrestamo[]=[];
  
  modalR:any;

  filtro: string = '';
  filtrar(texto: string) {
    this.filtro = texto;
  }

  filtroL: string = '';
  filtrarL(texto: string) {
    this.filtroL = texto;
  }

  constructor(private srv_usuarios:UsuariosServices, private srv_libros:LibrosServices, private srv_prestamo:PrestamoServices ,private fb:FormBuilder){
    
  console.log(this.fechaActual)
    this.obtenerUsuarios();
    this.obtenerLibros();
    this.obtenerPrestamos();
    this.formPrestamo = fb.group({
      id_usuario : ['', [Validators.required]],
      id_libro : ['', [Validators.required]],
      fechaPrestamo : ['', [Validators.required]],
      fechaDevolucion : ['', [Validators.required]],
      estado : ['', [Validators.required]]
    });
  }

  @ViewChild('modalPrestamoRef') modalElement !: ElementRef;
  ngAfterViewInit(){
    this.modalR = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  abrirModal(){
    this.isEditing = null;
    this.modalR.show();
  }

  editar(prestamo:IPrestamo){
    this.isEditing = prestamo.id_prestamo;
    this.formPrestamo.patchValue({
      ...prestamo
    });
    this.modalR.show();
  }

  eliminar(id:number){
    let isDelete = confirm("Estas seguro que quiere eliminar este prestamo");
    if(isDelete){
      this.srv_prestamo.deletePrestamo(id).subscribe(
        ()=>{
          alert("Prestamo Eliminado");
          this.obtenerPrestamos();
        }
      );
    }
  }

  obtenerUsuarios(){
    this.srv_usuarios.getUsuarios().subscribe(
      (data : IUsuarios[])=>{
        this.usuarios = data;
      }
    );
  }

  obtenerLibros(){
    this.srv_libros.getLibros().subscribe(
      (data : ILibros[])=>{
        this.libros = data;
      }
    );
  }

  obtenerPrestamos(){
    this.srv_prestamo.getPrestamos().subscribe(
      (data : IPrestamo[])=>{
        this.prestamos = data;
      }
    );
  }

  guardar(){
    if(this.formPrestamo.invalid){
      this.formPrestamo.markAllAsTouched();
      console.log(this.formPrestamo.value);
      return;
    }
    
    const datos = this.formPrestamo.value;

    if(this.isEditing){
      let prestamo = {...datos, id_prestamo:this.isEditing}

      this.srv_prestamo.putPrestamo(prestamo).subscribe(
        ()=>{
          alert("Prestamo Actualizado");
          this.obtenerPrestamos();
          this.modalR.hide();
        }
      );


    }else{
      let prestamos = {...datos};
      this.srv_prestamo.postPrestamo(prestamos).subscribe(
        ()=>{
          alert("Prestamo Guardado");
          this.obtenerPrestamos();
          this.modalR.hide();
        }
      );
    }

  }

  nombreUsuario(id:number){
    const user_Id = this.usuarios.find(
      (u) => Number(u.id_usuario) === Number(id)
    );

    return user_Id?.nombre || 'Sin Nombre';
  }

  nombreLibro(id:number){
    const libro_Id = this.libros.find(
      (u) => Number(u.id_libro) === Number(id)
    );

    return libro_Id?.titulo || 'Sin Titulo';
  }







}
