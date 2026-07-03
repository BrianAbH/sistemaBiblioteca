import { AbstractControl, ValidationErrors } from "@angular/forms";



export function validarCorreo(control:AbstractControl):ValidationErrors |null{
    const valor = control.value;
    if(valor && !valor.toLocaleLowerCase().endsWith('gmail.com')){
        return{DominioInvalido:true, mensaje:"Dominio no es el correcto"}
    }
    return null;
}