import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'loco-layout',
  imports: [RouterOutlet],
  styles: ``,
  template: `
    <main class="layout">
      <router-outlet/>
    </main>
  `
})

export class Layout {
}
