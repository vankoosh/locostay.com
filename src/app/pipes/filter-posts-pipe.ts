import { Pipe, PipeTransform } from '@angular/core';
import { Post } from "../models/post.model";

@Pipe({
  name: 'filterPosts'
})

export class FilterPostsPipe implements PipeTransform {
  transform(posts: Post[], searchTerm: string): Post[] {
    if (!searchTerm) {
      return [...posts];
    }
    return posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
