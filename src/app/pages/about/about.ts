import { Component, inject, OnInit, signal } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { RouterLink } from "@angular/router";
import { LinksService } from "../../services/links.service";
import { Post } from "../../models/post.model";
import { catchError } from 'rxjs';

@Component({
  imports: [Hero, RouterLink],
  selector: 'about',
  styles: ``,
  template: `
    <hero/>
    <h1>About</h1>
    <p (mouseenter)="showLinkInConsole()"> This is an about page</p>
    <h2 routerLink="/">Go to Home</h2>
    <p>Following are the urls</p>
    @for (url of postsFromApi(); track $index) {
      <p>{{ url.title }}</p>
    }
  `
})

export class About implements OnInit {
  linksService = inject(LinksService);
  links = signal<string[]>([''])
  postsFromApi = signal<Post[]>([])

  ngOnInit(): void {
    this.links.set(this.linksService.apiUrl)
    this.linksService.postsFromApi()
      .pipe(catchError((err) => {
        console.error(err);
        throw err;
      }))
      .subscribe(posts => {
        this.postsFromApi.set(posts.slice(0, 10))
      })
    console.log(this.links());
  }

  showLinkInConsole(): void {
    console.log(this.links());
    2
  }
}
