import { Injectable, computed, effect, signal } from '@angular/core';
import { Todo } from '../models/todo.model';

const STORAGE_KEY = 'todo-app.todos';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly storageAvailable = typeof localStorage !== 'undefined';

  private readonly todosSignal = signal<Todo[]>(this.loadTodos());

  readonly todos = this.todosSignal.asReadonly();
  readonly remainingCount = computed(
    () => this.todosSignal().filter((todo) => !todo.completed).length
  );
  readonly hasCompleted = computed(() =>
    this.todosSignal().some((todo) => todo.completed)
  );

  constructor() {
    effect(() => {
      if (!this.storageAvailable) {
        return;
      }

      const todos = this.todosSignal();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    });
  }

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    const todo: Todo = {
      id: this.createId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    this.todosSignal.update((current) => [...current, todo]);
  }

  toggle(id: string): void {
    this.todosSignal.update((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  remove(id: string): void {
    this.todosSignal.update((current) => current.filter((todo) => todo.id !== id));
  }

  clearCompleted(): void {
    this.todosSignal.update((current) => current.filter((todo) => !todo.completed));
  }

  private loadTodos(): Todo[] {
    if (!this.storageAvailable) {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(
          (item: unknown): item is Partial<Todo> =>
            !!item && typeof item === 'object' && 'title' in item
        )
        .map((item) => ({
          id: typeof item.id === 'string' ? item.id : this.createId(),
          title: typeof item.title === 'string' ? item.title : '',
          completed: Boolean((item as Todo).completed),
          createdAt:
            typeof item.createdAt === 'number'
              ? item.createdAt
              : Date.now()
        }))
        .filter((todo) => todo.title.trim().length > 0);
    } catch {
      return [];
    }
  }

  private createId(): string {
    const cryptoRef = typeof crypto !== 'undefined' ? crypto : undefined;
    if (cryptoRef && typeof cryptoRef.randomUUID === 'function') {
      return cryptoRef.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
