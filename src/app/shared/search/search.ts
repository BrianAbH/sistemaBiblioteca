import { Component, Input, Output, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html'
})

export class Search {
[x: string]: any;

  @Input() place:string="";

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  onSearch(value: string) {
    this.searchChange.emit(value.trim().toLowerCase());
  }

  prevent(event: Event) {
    event.preventDefault();
  }
}
