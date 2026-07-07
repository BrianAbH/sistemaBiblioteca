import { Component, ElementRef, ViewChild } from '@angular/core';
import { Search } from "../../shared/search/search";
import { UsuariosServices } from '../../services/usuarios/usuarios.services';
import { IUsuarios } from '../../models/usuarios.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { filtroUsuario } from "../../pipes/filtros";
import { validarCorreo } from '../../validators/Validators';
declare const bootstrap:any;

@Component({
  selector: 'app-usuarios',
  imports: [Search, ɵInternalFormsSharedModule, ReactiveFormsModule, filtroUsuario],
  templateUrl: './usuarios.html'
})


export class Usuarios {

  // Página actual de la lista de usuarios
  page = 1;
  // Cantidad de usuarios por página para la paginación
  pageSize = 12;

  // Lista de usuarios obtenida desde el servicio
  usuarios: IUsuarios[] = [];
  // ID del usuario que se está editando; null indica creación de nuevo usuario
  isEditing: number | null = null;

  // Formulario reactivo para crear o editar usuarios
  formUsuario!: FormGroup;

  // Referencia al modal de Bootstrap
  modalRef: any;

  // Mensaje que se muestra en el toast
  msjToast: string = '';

  // Texto del filtro de búsqueda aplicado a la lista de usuarios
  filtro: string = '';

  // Actualiza el texto del filtro de búsqueda
  filtrar(texto: string) {
    this.filtro = texto;
  }

  constructor(public srv_usuarios: UsuariosServices, public fb: FormBuilder) {
    this.cargarUsuarios();
    this.formUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      correo: ['', [Validators.required, Validators.email, validarCorreo]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      estado: [true]
    });
  }

  // Carga los usuarios desde el servicio y actualiza el arreglo local
  cargarUsuarios() {
    this.srv_usuarios.getUsuarios().subscribe(
      (data: IUsuarios[]) => {
        this.usuarios = data;
      }
    );
  }

  @ViewChild('modalUsuarioRef') modalElement!: ElementRef;

  // Inicializa el componente modal de Bootstrap después de renderizar la vista
  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // Abre el modal para crear un nuevo usuario
  abrirModal() {
    this.isEditing = null;
    this.modalRef.show();
    this.formUsuario.patchValue({
      nombre: '',
      correo: '',
      telefono: '',
      direccion: '',
    });
  }

  // Abre el modal para editar un usuario existente
  editarModal(usuario: IUsuarios) {
    this.isEditing = usuario.id_usuario || null;
    this.formUsuario.patchValue({
      ...usuario,
      estado: usuario.estado = true
    });
    this.modalRef.show();
  }

  // Guarda el usuario nuevo o actualiza el usuario existente
  guardar() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }
    const datos = this.formUsuario.value;
    if (this.isEditing) {
      let usuario: IUsuarios = { ...datos, id_usuario: this.isEditing };
      this.srv_usuarios.updateUsuario(usuario).subscribe(
        () => {
          this.modalRef.hide();
          this.cargarUsuarios();
          this.mostrarToast(usuario.nombre, "Actualizado Correctamente");
        }
      );

    } else {
      let usuario: IUsuarios = { ...datos };
      this.srv_usuarios.postUsuario(usuario).subscribe(
        () => {
          this.modalRef.hide();
          this.cargarUsuarios();
          this.mostrarToast(usuario.nombre, "Guardado Correctamente");
        }
      );
    }
  }

  // Elimina un usuario y muestra un mensaje de confirmación
  eliminar(id: number, nombre: string) {
    let isdelete = confirm("Estas seguro que eliminar este usuario");
    if (isdelete) {
      this.srv_usuarios.delete(id).subscribe(
        () => {
          this.cargarUsuarios();
          this.mostrarToast(nombre, "Eliminado Correctamente");
        }
      );
      this.mostrarToast(nombre, "No se puede eliminar el registro porque está siendo utilizado actualmente.");
    }
  }

  // Muestra un toast con el nombre del usuario y un mensaje
  mostrarToast(nombre: string, mensaje: string) {
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }

  // Métodos de paginación para la lista de usuarios
  get totalPages(): number {
    return Math.ceil(this.usuarios.length / this.pageSize);
  }

  get usuariosPagina(): IUsuarios[] {
    const start = (this.page - 1) * this.pageSize;
    return this.usuarios.slice(start, start + this.pageSize);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.page = n;
  }

}
