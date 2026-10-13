import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from "../models/post.model";

@Service()
export class LinksService {
  apiUrl = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2'
  ];

  http = inject(HttpClient);

  postsFromApi() {
    const url = 'https://jsonplaceholder.typicode.com/posts'
    return this.http.get<Post[]>(url)
  }
}
