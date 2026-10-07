import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'hero',
  styles: ``,
  template: `
    <p (click)="reactToClick($event)">{{ title() }}</p>
    <p (mouseenter)="hovered.emit()">Hover this element</p>
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
