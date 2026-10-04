import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";

@Component({
  imports: [Hero],
  selector: 'about',
  styles: ``,
  template: `
    <hero/>
    <h1>About</h1>
    <p> This is an about page</p>
    <h2></h2>
  `
})

export class About {

}
