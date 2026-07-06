import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { Search } from "../../shared/search/search";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsuarios } from '../../models/usuarios.model';
import { UsuariosServices } from '../../services/usuarios/usuarios.services';
import { LibrosServices } from '../../services/libros/libros.services';
import { ILibros } from '../../models/libros.model';
import { filtroUsuario, filtroLibro, filtroPrestamos } from "../../pipes/filtros";
import { PrestamoServices } from '../../services/prestamos/prestamo.services';
import { IPrestamo } from '../../models/prestamos.model';

declare const bootstrap:any;

@Component({
  selector: 'app-prestamos',
  imports: [Search, ReactiveFormsModule, filtroUsuario, filtroLibro, filtroPrestamos],
  templateUrl: './prestamos.html',
})
export class Prestamos {
  fechaActual = new Date();
  //Variables para la paginacion
  page = 1;
  pageSize = 12;

  msjToast:string = '';

  estados:string[]=["En Préstamo","Devuelto","Vencido"];
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
          this.obtenerPrestamos();
          this.modalR.hide();
          this.mostrarToast("Prestamo", "Actualizado Correctamente");
        }
      );


    }else{
      let prestamos = {...datos};
      this.srv_prestamo.postPrestamo(prestamos).subscribe(
        ()=>{
          this.obtenerPrestamos();
          this.modalR.hide();
          this.mostrarToast("Prestamo", "Guardado Correctamente");
        }
      );
    }

  }
  
  eliminar(id:number){
    let isDelete = confirm("Estas seguro que quiere eliminar este prestamo");
    if(isDelete){
      this.srv_prestamo.deletePrestamo(id).subscribe(
        ()=>{
          this.obtenerPrestamos();
          this.mostrarToast("Prestamo", "Eliminado Correctamente");
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

  mostrarToast(nombre: string, mensaje:string){
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }

  //Metodos para lograr la paginacion Categorias
    get totalPages(): number {
      return Math.ceil(this.prestamos.length / this.pageSize);
    }
    get prestamosPagina(): IPrestamo[] {
      const start = (this.page - 1) * this.pageSize;
      return this.prestamos.slice(start, start + this.pageSize);
    }
  
    cambiarPagina(n: number) {
      if (n < 1 || n > this.totalPages) return;
      this.page = n;
    }






}
