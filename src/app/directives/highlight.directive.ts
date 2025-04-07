// src/app/directives/highlight.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (this.appHighlight) {
      this.el.nativeElement.style.backgroundColor = 'yellow';
    }
  }
}
