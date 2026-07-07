# Sistema de Biblioteca

Aplicación web de gestión de biblioteca desarrollada con Angular 20.3.5.
Esta aplicación permite administrar usuarios, libros, categorías y préstamos desde un panel protegido.

## Características

- Autenticación básica y rutas protegidas con `AuthGuard`
- Gestión completa de usuarios: alta, edición, eliminación y búsqueda
- Gestión de libros: alta, edición, eliminación, categorías y paginación
- Gestión de préstamos: registro, edición, eliminación y listado con paginación
- Formularios reactivos con validaciones integradas
- Interfaz con Bootstrap para modales y notificaciones tipo toast

## Estructura principal

- `src/app/components/login` - pantalla de inicio de sesión
- `src/app/components/menu` - estructura de menú principal
- `src/app/components/dashboard` - panel principal
- `src/app/components/usuarios` - administración de usuarios
- `src/app/components/libros` - administración de libros y categorías
- `src/app/components/prestamos` - administración de préstamos
- `src/app/services` - servicios para consumir APIs
- `src/app/guards/auth.guard.ts` - protección de rutas autenticadas
- `src/app/app.routes.ts` - configuración de rutas de la aplicación

## Rutas principales

- `/login` - iniciar sesión
- `/menu-vista/dashboard-vista` - dashboard principal
- `/menu-vista/usuarios-vista` - módulo de usuarios
- `/menu-vista/libros-vista` - módulo de libros y categorías
- `/menu-vista/prestamos-vista` - módulo de préstamos

## Requisitos

- Node.js 20 o superior
- Angular CLI 20.x
- npm 10+ recomendado

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

## Ejecución local

```bash
npm start
```

Luego abre `http://localhost:4200/` en tu navegador.

## Comandos útiles

- `npm run build` - compila el proyecto para producción
- `npm run watch` - compila en modo observación
- `npm test` - ejecuta pruebas unitarias

## Notas

- Este proyecto utiliza Angular 20 y Bootstrap para la interfaz.
- Asegúrate de tener el backend o servicios de API necesarios en ejecución si la app depende de ellos.
- Si necesitas generar componentes o servicios adicionales, usa el CLI de Angular.

## Credenciales de acceso

- Correo: `ba749491@gmail.com`
- Contraseña: `bibliotecarioPrincipal`

## Recursos

- [Angular CLI](https://angular.io/cli)
- [Angular Forms](https://angular.io/guide/forms)
- [Bootstrap](https://getbootstrap.com/)
