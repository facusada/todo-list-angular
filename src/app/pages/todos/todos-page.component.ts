import { Component, computed, signal, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

type TodoFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [NgIf, NgFor, TodoFormComponent, TodoListComponent],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css'
})
export class TodosPageComponent {
  private readonly todoService = inject(TodoService);

  protected readonly filter = signal<TodoFilter>('all');

  protected readonly todos = this.todoService.todos;
  protected readonly filteredTodos = computed(() =>
    this.applyFilter(this.todoService.todos(), this.filter())
  );
  protected readonly remainingCount = this.todoService.remainingCount;
  protected readonly hasCompleted = this.todoService.hasCompleted;

  protected readonly filters: TodoFilter[] = ['all', 'active', 'completed'];

  protected onAdd(title: string): void {
    this.todoService.add(title);
  }

  protected onToggle(id: string): void {
    this.todoService.toggle(id);
  }

  protected onRemove(id: string): void {
    this.todoService.remove(id);
  }

  protected clearCompleted(): void {
    if (!this.hasCompleted()) {
      return;
    }

    this.todoService.clearCompleted();
  }

  protected setFilter(filter: TodoFilter): void {
    this.filter.set(filter);
  }

  protected filterLabel(filter: TodoFilter): string {
    switch (filter) {
      case 'active':
        return 'Activas';
      case 'completed':
        return 'Completadas';
      default:
        return 'Todas';
    }
  }

  protected isActive(filter: TodoFilter): boolean {
    return this.filter() === filter;
  }

  private applyFilter(todos: Todo[], filter: TodoFilter): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
}
