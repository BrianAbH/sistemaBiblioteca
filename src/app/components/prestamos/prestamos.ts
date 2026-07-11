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
  // Fecha actual que puede usarse en validaciones o filtros de préstamos
  fechaActual = new Date();
  // Página actual del listado de préstamos
  page = 1;
  // Cantidad de registros mostrados por página
  pageSize = 12;

  // Mensaje mostrado en el toast de notificación
  msjToast: string = '';

  // Estados disponibles para un préstamo
  estados: string[] = ["En Préstamo", "Devuelto", "Vencido"];
  // ID del préstamo que se está editando; null indica nuevo registro
  isEditing: number | null = null;
  
  // Formulario reactivo para crear o editar préstamos
  formPrestamo: FormGroup;
  // Usuarios disponibles para seleccionar en el préstamo
  usuarios: IUsuarios[] = [];
  // Libros disponibles para seleccionar en el préstamo
  libros: ILibros[] = [];
  // Préstamos cargados desde el servicio
  prestamos: IPrestamo[] = [];
  
  // Referencia al modal de Bootstrap para préstamos
  modalR: any;

  // Texto del filtro principal para usuarios y préstamos
  filtro: string = '';
  filtrar(texto: string) {
    this.filtro = texto;
  }

  // Texto del filtro secundario para libros
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

  // Inicializa el modal de Bootstrap cuando la vista está lista
  ngAfterViewInit() {
    this.modalR = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // Abre el modal para crear un nuevo préstamo
  abrirModal() {
    this.isEditing = null;
    this.modalR.show();
  }

  // Abre el modal para editar un préstamo existente
  editar(prestamo: IPrestamo) {
    this.isEditing = prestamo.id_prestamo;
    this.formPrestamo.patchValue({
      ...prestamo
    });
    this.modalR.show();
  }

  // Carga la lista de usuarios desde el servicio
  obtenerUsuarios() {
    this.srv_usuarios.getUsuarios().subscribe(
      (data: IUsuarios[]) => {
        this.usuarios = data;
      }
    );
  }

  // Carga la lista de libros desde el servicio
  obtenerLibros() {
    this.srv_libros.getLibros().subscribe(
      (data: ILibros[]) => {
        this.libros = data;
      }
    );
  }

  // Carga la lista de préstamos desde el servicio
  obtenerPrestamos() {
    this.srv_prestamo.getPrestamos().subscribe(
      (data: IPrestamo[]) => {
        this.prestamos = data;
      }
    );
  }

  // Guarda un nuevo préstamo o actualiza uno existente
  guardar() {
  if (this.formPrestamo.invalid) {
    this.formPrestamo.markAllAsTouched();
    console.log(this.formPrestamo.value);
    return;
  }
  
  const datos = this.formPrestamo.value;

  if (this.isEditing) {
    let prestamo = { ...datos, id_prestamo: this.isEditing };
    this.srv_prestamo.putPrestamo(prestamo).subscribe({
      next: () => {
        this.obtenerPrestamos();
        this.modalR.hide();
        this.mostrarToast("Prestamo", "Actualizado Correctamente");
      },
      error: (err) => {
        const mensaje = err.error || "Error al actualizar el préstamo";
        this.mostrarToast("Error", mensaje); 
      }
    });

  } else {
    let prestamos = { ...datos };
    this.srv_prestamo.postPrestamo(prestamos).subscribe({
      next: () => {
        this.obtenerPrestamos();
        this.modalR.hide();
        this.mostrarToast("Prestamo", "Guardado Correctamente");
      },
      error: (err) => {
        const mensaje = err.error || "Error al guardar el préstamo";
        this.mostrarToast("Error", mensaje);
      }
    });
  }
}
  
  // Elimina un préstamo por su ID
  eliminar(id: number) {
    let isDelete = confirm("Estas seguro que quiere eliminar este prestamo");
    if (isDelete) {
      this.srv_prestamo.deletePrestamo(id).subscribe(
        () => {
          this.obtenerPrestamos();
          this.mostrarToast("Prestamo", "Eliminado Correctamente");
        }
      );
    }
  }

  // Busca y devuelve el nombre del usuario asociado al préstamo
  nombreUsuario(id: number) {
    const user_Id = this.usuarios.find(
      (u) => Number(u.id_usuario) === Number(id)
    );

    return user_Id?.nombre || 'Sin Nombre';
  }

  // Busca y devuelve el título del libro asociado al préstamo
  nombreLibro(id: number) {
    const libro_Id = this.libros.find(
      (u) => Number(u.id_libro) === Number(id)
    );

    return libro_Id?.titulo || 'Sin Titulo';
  }

  // Muestra un toast con el nombre y mensaje indicados
  mostrarToast(nombre: string, mensaje: string) {
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }

  // Métodos para la paginación de préstamos
  get totalPages(): number {
    return Math.ceil(this.prestamos.length / this.pageSize);
  }

  get prestamosPagina(): IPrestamo[] {
    const start = (this.page - 1) * this.pageSize;
    return this.prestamos.slice(start, start + this.pageSize);
  }

  // Cambia la página actual si el número es válido
  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.page = n;
  }

}
