import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'counter-component',
  styles: ``,
  template: `
    <h1>Counter value: {{ value() }}</h1>
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset</button>
  `
})
export class CounterComponent {
  value = signal(0)

  increment() {
    this.value.update((val) => val + 1)
  }

  decrement() {
    this.value.update((val) => val - 1)
  }

  reset() {
    this.value.set(0)
  }
}
