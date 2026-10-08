import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'hero',
  styles: `
    .hero {
      background-color: red
    }

    ;
  `,
  template: `
    <div class="hero">
      <h1>This is a hero component</h1>
      <p (click)="reactToClick($event)">{{ title() }}</p>
      <p (mouseenter)="hovered.emit()">Hover this element</p>
    </div>
  `
})

export class Hero {
  title = input<string>('')

  hovered = output<void>()

  reactToClick($: MouseEvent) {
    const element = $.target as HTMLElement
    console.log(element.textContent)
  }
}
