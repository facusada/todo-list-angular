import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'li[app-todo-item]',
  standalone: true,
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
  host: {
    class: 'todo-item',
    '[class.completed]': 'todo?.completed ?? false'
  }
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;

  @Output() toggle = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  protected onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  protected onRemove(): void {
    this.remove.emit(this.todo.id);
  }
}
