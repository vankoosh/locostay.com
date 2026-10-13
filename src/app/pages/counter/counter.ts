import { Component } from '@angular/core';
import { CounterComponent } from "../../components/counter/counter-component";

@Component({
  imports: [CounterComponent],
  selector: 'counter',
  styles: ``,
  template: `
    <counter-component/>
  `
})
export class Counter {
}
