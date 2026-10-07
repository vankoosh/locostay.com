import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { RouterLink } from "@angular/router";

@Component({
  imports: [Hero, RouterLink],
  selector: 'about',
  styles: ``,
  template: `
    <hero/>
    <h1>About</h1>
    <p> This is an about page</p>
    <h2 routerLink="/">Go to Home</h2>
  `
})

export class About {

}
