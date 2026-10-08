import { Component, inject, OnInit, signal } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { RouterLink } from "@angular/router";
import { LinksService } from "../../services/links.service";
import { Post } from "../../models/post.model";
import { catchError } from 'rxjs';
import { CheckboxItem } from "../../components/checkbox-item/checkbox-item";

@Component({
  imports: [Hero, RouterLink, CheckboxItem],
  selector: 'about',
  styles: ``,
  template: `
    <hero/>
    <h1>About</h1>
    <p (mouseenter)="showLinkInConsole()"> This is an about page</p>
    <h2 routerLink="/">Go to Home</h2>
    <p>Following are the urls</p>
    @if (isLoading()) {
      <h1>Loading...</h1>
    }
    @for (post of postsFromApi(); track $index) {
      <checkbox-item id="checkbox-{{post.id}}" [postItem]="post"/>
    }
  `
})

export class About implements OnInit {
  linksService = inject(LinksService);
  links = signal<string[]>([''])
  postsFromApi = signal<Post[]>([])
  isLoading = signal(true)

  ngOnInit(): void {
    console.log('About ngOnInit, loading:', this.isLoading());

    this.links.set(this.linksService.apiUrl)
    this.linksService.postsFromApi()
      .pipe(catchError((err) => {
        console.error(err);
        this.isLoading.set(false)
        throw err;
      }))
      .subscribe(posts => {
        this.postsFromApi.set(posts.slice(0, 10))
        this.isLoading.set(false)
      })
    console.log(this.links());
  }

  showLinkInConsole(): void {
    console.log(this.links());
  }
}
