import { Directive, input, effect, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[highlightElementDirective]'
})

export class HighlightElementDirective {
  isCompleted = input<boolean>(false)
  el = inject(ElementRef)

  makeBoldEffect = effect(() => {
    console.log('Effect triggered')

    if (this.isCompleted()) {
      this.el.nativeElement.classList.add('bold')
    } else {
      this.el.nativeElement.classList.remove('bold')
    }
  })
}
