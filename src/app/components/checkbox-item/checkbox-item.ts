import { Component, input, output } from '@angular/core';
import { Post } from '../../models/post.model';
import { HighlightElementDirective } from "../../directives/highlight-element-directive";

@Component({
  imports: [HighlightElementDirective],
  selector: 'checkbox-item',
  styles: `
    .bold {
      font-weight: bold;
    }`,
  template: `
    <input
      id="checkbox-{{ postItem()?.id }}"
      type="checkbox"
      [checked]="postItem()?.completed"
      (change)="checkboxClicked()"
    >
    <label
      highlightElementDirective
      for="checkbox-{{ postItem()?.id }}"
      [isCompleted]="postItem()?.completed"
    >{{ postItem()?.title }}</label>
  `
})

export class CheckboxItem {
  postItem = input.required<Post>()
  isChecked = output<Post>()

  checkboxClicked() {
    this.isChecked.emit(this.postItem())
  }
}
