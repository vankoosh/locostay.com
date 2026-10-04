import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'loco-layout',
  imports: [RouterOutlet],
  styles: `
    .layout {
      display: flex;
      flex-direction: column;
      padding: 0 10%;
      max-width: 1200px;
      margin: 0 auto;
    }
  `,
  template: `
    <main class="layout">
      <router-outlet/>
    </main>
  `
})

export class Layout {
}
