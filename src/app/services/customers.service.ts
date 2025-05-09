import { Injectable, signal, effect } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

export interface Customer {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly _list = signal<Customer[]>([]);
  readonly list = this._list.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private api: ApiService) {
    effect(() => {
      this.loadAll();
    });
  }

  async loadAll(): Promise<void> {
    try {
      const customers = await firstValueFrom(
        this.api.getAll<Customer>('customers')
      );
      this._list.set(customers);
      this._error.set(null);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      this._list.set([]);
      this._error.set('Erro ao carregar clientes');
    }
  }
}
