import { Component, signal } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { RouterLink } from '@angular/router';

@Component({
  imports: [Hero, RouterLink],
  selector: 'home',
  styles: `
    .home {
      background-color: lightcoral;
    }
  `,
  template: `
    <div class="home">
      <hero [title]="titleFromHome()" (hovered)="hoveredElement($event)"/>
      <h1>This is the Home page component</h1>
      <h1>Home</h1>
      <p>This is home page</p>
      <p routerLink="/about">Go to About page</p>
    </div>
  `
})

export class Home {
  readonly titleFromHome = signal('locostay.com');

  hoveredElement($event: MouseEvent) {
    const el = $event.target as HTMLElement
    console.log('hovered ' + el.textContent)
  }

  headings = signal(['Home', 'About', 'Contact']);
  readonly links = signal([
    { title: 'Explore the Docs', link: 'https://angular.dev' },
    { title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials' },
    { title: 'Prompt and best practices for AI', link: 'https://angular.dev/ai/develop-with-ai' },
    { title: 'CLI Docs', link: 'https://angular.dev/tools/cli' },
    { title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service' },
    { title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools' }
  ]);
}
