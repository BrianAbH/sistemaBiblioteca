export interface IPrestamo{
    id_prestamo:number;
    id_usuario:number;
    id_libro:number;
    fechaPrestamo:Date;
    fechaDevolucion:Date;
    estado:string;
}

