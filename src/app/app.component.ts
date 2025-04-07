// app.component.ts (standalone)
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, MatToolbarModule],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent {}
