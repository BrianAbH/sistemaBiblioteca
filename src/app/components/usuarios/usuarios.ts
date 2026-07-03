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

  //Variables para la paginacion
  page = 1;
  pageSize = 12;

  usuarios: IUsuarios[]=[];
  isEditing:number|null = null;

  formUsuario!:FormGroup;

  modalRef:any;

  msjToast:string = '';


  filtro: string = '';
  filtrar(texto: string) {
    this.filtro = texto;
  }

  constructor(public srv_usuarios:UsuariosServices, public fb:FormBuilder){
    this.cargarUsuarios();
    this.formUsuario = this.fb.group({
        nombre : ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/) ]],
        correo : ['',[ Validators.required, Validators.email, validarCorreo]],
        telefono : ['',[ Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/) ]],
        direccion : ['',[ Validators.required, Validators.minLength(10), Validators.maxLength(100) ]],
        estado : [true]
    });
  }


  cargarUsuarios(){
    this.srv_usuarios.getUsuarios().subscribe(
        (data: IUsuarios[])=>{
          this.usuarios = data;
        }
    );
  }

  @ViewChild('modalUsuarioRef') modalElement!:ElementRef;
  ngAfterViewInit(){
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  abrirModal(){
    this.isEditing=null;
    this.modalRef.show();
    this.formUsuario.patchValue({
      nombre : '',
      correo : '',
      telefono : '',
      direccion : '',
    });
  }

  editarModal(usuario:IUsuarios){
    this.isEditing = usuario.id_usuario || null;
    this.formUsuario.patchValue({
      ...usuario,
      estado: usuario.estado = true
    });
    this.modalRef.show();
  }

  guardar(){
    if(this.formUsuario.invalid){
      this.formUsuario.markAllAsTouched();
      return;
    }
    const datos = this.formUsuario.value;
    if(this.isEditing){
      let usuario:IUsuarios = {...datos, id_usuario:this.isEditing}
      this.srv_usuarios.updateUsuario(usuario).subscribe(
        ()=>{
          this.msjToast = "Usuario actualizado";
          alert("usuario actualizada");
          this.modalRef.hide();
          this.cargarUsuarios();
          this.mostrarToast(usuario.nombre, "Actualizado Correctamente");
        }
      );

    }else{
      let usuario:IUsuarios = {...datos};
      this.srv_usuarios.postUsuario(usuario).subscribe(
        ()=>{
          this.modalRef.hide();
          this.cargarUsuarios();
          this.mostrarToast(usuario.nombre, "Guardado Correctamente");
        }
      );
    }
  }

  eliminar(id:number, nombre:string){
    let isdelete = confirm("Estas seguro que eliminar este usuario");
    if(isdelete){
      this.srv_usuarios.delete(id).subscribe(
        ()=>{
          this.cargarUsuarios();
          this.mostrarToast(nombre, "Eliminado Correctamente");
        }
       
      );
      alert("No se puede eliminar el registro porque está siendo utilizado actualmente.");
    }

  }

  mostrarToast(nombre: string, mensaje:string){
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }

  //Metodos para lograr la paginacion
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
