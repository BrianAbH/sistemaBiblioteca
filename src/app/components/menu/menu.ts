import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-menu',
  imports: [RouterLinkActive, RouterLinkWithHref, RouterOutlet],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

}
