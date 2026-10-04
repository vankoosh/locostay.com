import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";

@Component({
  imports: [Hero],
  selector: 'home',
  styles: ``,
  template: `
    <hero/>
    <h1>Home</h1>
    <p>This is home page</p>
  `
})
export class Home {
}
