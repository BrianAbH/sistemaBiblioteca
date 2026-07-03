import { Component, ElementRef, ViewChild } from '@angular/core';
import { Search } from '../../shared/search/search';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ILibros } from '../../models/libros.model';
import { ICategorias } from '../../models/categorias.model';
import { LibrosServices } from '../../services/libros/libros.services';
import { filtroLibro, filtroCategorias } from "../../pipes/filtros";
import { CategoriasServices } from '../../services/categoria/categoria.services';

declare const bootstrap: any;

@Component({
  selector: 'app-libros',
  imports: [Search, ReactiveFormsModule, filtroLibro, filtroCategorias],
  templateUrl: './libros.html'
})
export class Libros {

  //Variables para la paginacion
  page = 1;
  pageSize = 12;
  //Variables para la paginacion Categorias
  pageC = 1;
  pageSizeC = 2;

  // Listas principales
  libros: ILibros[] = [];
  categorias: ICategorias[] = [];

  // Almacena el ID del registro que se está editando
  isEditing: number | null = null;

  // Formularios reactivos
  formLibro: FormGroup;
  formCategoria: FormGroup;

  // Referencias de los modales Bootstrap
  modalRefL: any;
  modalRefC: any;
  modalRefcs: any;

  msjToast:string = '';

  filtro: string = '';
  filtrar(texto: string) {
    this.filtro = texto;
  }

  constructor(private srv_libro: LibrosServices,private srv_categoria: CategoriasServices,private fb: FormBuilder) {
    // Carga inicial de datos
    this.cargarLibros();
    this.cargarCategorias();

    // Formulario de libros
    this.formLibro = this.fb.group({
      titulo: ['', Validators.required, Validators.minLength(3)],
      isbn: ['',[Validators.required,Validators.pattern(/^\d+$/),Validators.maxLength(13), Validators.minLength(13)]],
      autor: ['', Validators.required, Validators.minLength(3)],
      id_categoria: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      ejemplares: ['', Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      estado: [true]
    });

    // Formulario de categorías
    this.formCategoria = this.fb.group({
      nombre_categoria: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  // Referencias a los elementos HTML de los modales
  @ViewChild('modalLibroRef') modalElement!: ElementRef;
  @ViewChild('modalCategoriaRef') modalEl!: ElementRef;
  @ViewChild('modalCategoriasRef') modalElcs!: ElementRef;

  /**
   * Inicializa los modales de Bootstrap
   */
  ngAfterViewInit(): void {
    this.modalRefL = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modalRefC = new bootstrap.Modal(this.modalEl.nativeElement);
    this.modalRefcs = new bootstrap.Modal(this.modalElcs.nativeElement);
  }

  /* Abre el modal para registrar un libro*/
  abrirModal(): void {
    this.isEditing = null;

    this.formLibro.reset({
      estado: true
    });

    this.modalRefL.show();
  }

  /*Carga la información del libro seleccionado en el formulario*/
  editar(libro: ILibros): void {
    this.isEditing = libro.id_libro ?? null;
    this.formLibro.patchValue({
      ...libro,
      estado: true
    });
    this.modalRefL.show();
  }

  /* Carga la información de la categoría seleccionada*/
  editarCategoria(categoria: ICategorias): void {
    this.isEditing = categoria.id_categoria ?? null;
    this.formCategoria.patchValue({
      ...categoria
    });
    this.modalRefC.show();
  }

  /*Abre el modal para registrar una categoría*/
  abrirModalCategoria(): void {
    this.isEditing = null;
    this.formCategoria.reset();
    this.modalRefC.show();
  }

  /* Abre el modal que muestra las categorías*/
  abrirModalCategorias(): void {
    this.isEditing = null;
    this.modalRefcs.show();
  }

  /*Obtiene todos los libros desde la API*/
  cargarLibros(): void {
    this.srv_libro.getLibrosD().subscribe((data: ILibros[]) => {
      this.libros = data;
    });
  }

  /* Obtiene todas las categorías desde la API*/
  cargarCategorias(): void {
    this.srv_categoria.getCategorias().subscribe((data: ICategorias[]) => {
      this.categorias = data;
    });
  }

  /*Retorna el nombre de una categoría a partir de su ID*/
  nombreCategoria(id: number): string {
    const categoria = this.categorias.find(
      c => Number(c.id_categoria) === Number(id)
    );
    return categoria?.nombre_categoria || 'Sin Categoría';
  }

  /*Guarda o actualiza un libro*/
  guardarLibro(): void {
    if (this.formLibro.invalid) {
      this.formLibro.markAllAsTouched();
      return;
    }
    const datos = this.formLibro.value;

    // Actualización
    if (this.isEditing) {
      const libro: ILibros = {...datos,id_libro: this.isEditing};

      this.srv_libro.updateLibro(libro).subscribe(() => {
        this.cargarLibros();
        this.modalRefL.hide();
        this.mostrarToast(libro.titulo, "Actualizado Correctamente");
      });
      return;
    }
    // Registro
    const libro: ILibros = { ...datos };
    this.srv_libro.postLibro(libro).subscribe(() => {
      this.cargarLibros();
      this.modalRefL.hide();
      this.mostrarToast(libro.titulo, "Guardado Correctamente");
    });
  }

  eliminarLibro(id:number, titulo:string) {
    let isDelete = confirm('Esta seguro que quiere eliminar este libro');
    if(isDelete){
      this.srv_libro.deleteLibro(id).subscribe(
        ()=>{
          this.cargarLibros();
          this.mostrarToast(titulo, "Eliminado Correctamente");
        }
      );
      this.mostrarToast(titulo, "No se puede eliminar el registro porque está siendo utilizado actualmente.");
    }
  }
  /*Guarda o actualiza una categoría*/
  guardarCategoria(): void {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    const datos = this.formCategoria.value;

    // Actualización
    if (this.isEditing) {
      const categoria = {...datos,id_categoria: this.isEditing};
      this.srv_categoria.putCategoria(categoria).subscribe(() => {
        alert('Categoría actualizada');
        this.cargarCategorias();
        this.modalRefC.hide();
      });

      return;
    }

    // Registro
    const categoria: ICategorias = { ...datos };

    this.srv_categoria.postCategoria(categoria).subscribe(() => {
      alert('Categoría guardada');
      this.cargarCategorias();
      this.modalRefC.hide();
    });
  }

  //Metodos para lograr la paginacion
  get totalPages(): number {
    return Math.ceil(this.libros.length / this.pageSize);
  }
  get librosPagina(): ILibros[] {
    const start = (this.page - 1) * this.pageSize;
    return this.libros.slice(start, start + this.pageSize);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.page = n;
  }

  mostrarToast(nombre: string, mensaje:string){
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }


  //Metodos para lograr la paginacion Categorias
  get totalPagesC(): number {
    return Math.ceil(this.categorias.length / this.pageSizeC);
  }
  get categoriaPagina(): ICategorias[] {
    const start = (this.pageC - 1) * this.pageSizeC;
    return this.categorias.slice(start, start + this.pageSizeC);
  }

  cambiarPaginaC(n: number) {
    if (n < 1 || n > this.totalPagesC) return;
    this.pageC = n;
  }


}