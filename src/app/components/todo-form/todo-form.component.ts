import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  @Input() placeholder = 'Agregar una nueva tarea';
  @Input() buttonLabel = 'Agregar';

  @Output() add = new EventEmitter<string>();

  protected readonly draft = signal('');

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.draft.set(input?.value ?? '');
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    const value = this.draft().trim();
    if (!value) {
      return;
    }

    this.add.emit(value);
    this.draft.set('');
  }
}
