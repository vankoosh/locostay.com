import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'hero',
  styles: ``,
  template: `
    <p>{{ title() }}</p>
  `
})

export class Hero {
  title = input<String>('')
}
