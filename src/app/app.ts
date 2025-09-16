import { Component } from '@angular/core';
import { TodosPageComponent } from './pages/todos/todos-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodosPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
