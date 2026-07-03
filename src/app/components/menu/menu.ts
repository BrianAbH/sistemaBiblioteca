import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLinkActive, RouterLinkWithHref, RouterOutlet],
  templateUrl: './menu.html',
})
export class Menu {

  correo:string|null="";

  constructor(public auth: AuthService){
    this.correo = this.auth.getUserCorreo();
  }

  

}
