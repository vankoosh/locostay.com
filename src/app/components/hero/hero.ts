import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'hero',
  styles: ``,
  template: `
    <p>hero works!</p>
  `
})

export class Hero {
  readonly title = signal('locostay.com');
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
