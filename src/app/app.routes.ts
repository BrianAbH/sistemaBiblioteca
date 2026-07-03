import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Menu } from './components/menu/menu';
import { Dashboard } from './components/dashboard/dashboard';
import { Usuarios } from './components/usuarios/usuarios';
import { Libros } from './components/libros/libros';
import { Prestamos } from './components/prestamos/prestamos';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

    {path: "menu-vista", canActivate: [AuthGuard], component: Menu,
        children: [
            {path:"dashboard-vista", component: Dashboard},
            {path:"usuarios-vista", component: Usuarios},
            {path:"libros-vista", component: Libros},
            {path:"prestamos-vista", component: Prestamos},
            {path:"", redirectTo:"dashboard-vista", pathMatch:"full"}
    ]},
    // RUTAS SIN MENÚ
    {path:"login", component: Login},

    {path:"", redirectTo:"login", pathMatch:"full"}
];
