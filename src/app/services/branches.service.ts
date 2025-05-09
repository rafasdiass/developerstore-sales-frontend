// src/app/services/branches.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Branch, CreateBranchCommand } from '../models/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchesService {
  private readonly resource = 'branches';

  // estado reativo interno
  private readonly _list = signal<Branch[]>([]);
  readonly list = this._list.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private api: ApiService) {
    // dispara a carga inicial
    effect(() => {
      this.loadAll();
    });
  }

  /** Carrega todas as filiais e atualiza sinais */
  loadAll(): void {
    this._error.set(null);
    this._loading.set(true);

    this.api.getAll<Branch>(this.resource).subscribe({
      next: (branches: Branch[]) => {
        this._list.set(branches);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Falha ao carregar filiais');
        this._loading.set(false);
      },
    });
  }

  /** Cria uma nova filial e adiciona ao sinal interno */
  create(cmd: CreateBranchCommand): void {
    this._error.set(null);
    this._loading.set(true);

    this.api
      .create<CreateBranchCommand, Branch>(this.resource, cmd)
      .pipe(
        tap((newBranch: Branch) => {
          this._list.update((list) => [...list, newBranch]);
        })
      )
      .subscribe({
        next: () => this._loading.set(false),
        error: () => {
          this._error.set('Falha ao criar filial');
          this._loading.set(false);
        },
      });
  }

  /** Exclui a filial e remove do sinal interno */
  delete(id: string): void {
    this._error.set(null);
    this._loading.set(true);

    this.api.delete<void>(this.resource, id).subscribe({
      next: () => {
        this._list.update((list) => list.filter((b) => b.id !== id));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Falha ao excluir filial');
        this._loading.set(false);
      },
    });
  }
}
