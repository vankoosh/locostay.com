import { Component } from '@angular/core';
import { Layout } from './layout/layout';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  imports: [Layout, Navbar, Footer],
  selector: 'loco-root',
  styles: ``,
  template: `
    <loco-navbar/>
    <loco-layout/>
    <loco-footer/>
  `
})
export class App {
}
