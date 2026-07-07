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

  // Página actual del listado de libros
  page = 1;
  // Cantidad de libros mostrados por página
  pageSize = 12;
  // Página actual del listado de categorías
  pageC = 1;
  // Cantidad de categorías mostradas por página
  pageSizeC = 2;

  // Listado de libros cargados desde el servicio
  libros: ILibros[] = [];
  // Listado de categorías cargadas desde el servicio
  categorias: ICategorias[] = [];

  // ID del libro o categoría que se está editando; null indica creación
  isEditing: number | null = null;

  // Formularios reactivos para libro y categoría
  formLibro: FormGroup;
  formCategoria: FormGroup;

  // Referencias a los modales de Bootstrap
  modalRefL: any;
  modalRefC: any;
  modalRefcs: any;

  // Mensaje mostrado en el toast de notificación
  msjToast: string = '';

  // Texto del filtro para búsqueda de libros o categorías
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
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      isbn: ['',[Validators.required,Validators.pattern(/^\d+$/),Validators.maxLength(13), Validators.minLength(13)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      id_categoria: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      ejemplares: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
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

  // Muestra un toast con el título y mensaje especificados
  mostrarToast(nombre: string, mensaje: string) {
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    this.msjToast = `${nombre} ${mensaje}`;
    toast.show();
  }


  // Métodos para la paginación de categorías
  get totalPagesC(): number {
    return Math.ceil(this.categorias.length / this.pageSizeC);
  }

  // Categorías mostradas en la página actual
  get categoriaPagina(): ICategorias[] {
    const start = (this.pageC - 1) * this.pageSizeC;
    return this.categorias.slice(start, start + this.pageSizeC);
  }

  // Cambia la página actual de categorías si el número es válido
  cambiarPaginaC(n: number) {
    if (n < 1 || n > this.totalPagesC) return;
    this.pageC = n;
  }


}