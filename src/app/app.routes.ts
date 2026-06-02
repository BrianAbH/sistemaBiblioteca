import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Menu } from './components/menu/menu';
import { Resumen } from './components/resumen/resumen';
import { Usuarios } from './components/usuarios/usuarios';
import { Libros } from './components/libros/libros';
import { Prestamos } from './components/prestamos/prestamos';

export const routes: Routes = [

    {path: "menu-vista", component: Menu,
        children: [
            {path:"resumen-vista", component: Resumen},
            {path:"usuarios-vista", component: Usuarios},
            {path:"libros-vista", component: Libros},
            {path:"prestamos-vista", component: Prestamos},
            {path:"", redirectTo:"resumen-vista", pathMatch:"full"}
    ]},
    // RUTAS SIN MENÚ
    {path:"login", component: Login},

    {path:"", redirectTo:"login", pathMatch:"full"}
];
