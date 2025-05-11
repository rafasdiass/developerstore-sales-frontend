import { Injectable, signal, computed, effect } from '@angular/core';
import { ApiService } from './api.service';
import { Sale } from '../models/sale.model';
import { CreateSaleCommand } from '../models/create-sale-command.model';
import { UpdateSaleCommand } from '../models/update-sale-command.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly resource = 'sales';

  private readonly _sales = signal<Sale[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly sales = this._sales.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasSales = computed(
    () => !this.loading() && this.sales().length > 0
  );

  constructor(private readonly api: ApiService) {
    effect(() => {
      this.loadAll();
    });
  }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const result = await firstValueFrom(this.api.getAll<Sale>(this.resource));
      this._sales.set(result);
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      this._sales.set([]);
      this._error.set('Erro ao carregar vendas');
    } finally {
      this._loading.set(false);
    }
  }

  async createSale(command: CreateSaleCommand): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(
        this.api.create<CreateSaleCommand, { id: string }>(
          this.resource,
          command
        )
      );
      await this.loadAll();
    } catch (err) {
      console.error('Falha ao criar venda:', err);
      this._error.set('Falha ao criar venda');
    } finally {
      this._loading.set(false);
    }
  }

  async updateSale(id: string, command: UpdateSaleCommand): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(
        this.api.patch<UpdateSaleCommand, void>(this.resource, id, command)
      );
      await this.loadAll(); // recarrega a lista após atualização
    } catch (err) {
      console.error('Falha ao atualizar venda:', err);
      this._error.set('Falha ao atualizar venda');
    } finally {
      this._loading.set(false);
    }
  }

  async deleteSale(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.api.delete<void>(this.resource, id));
      this._sales.update((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Falha ao excluir venda:', err);
      this._error.set('Falha ao excluir venda');
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: string): Promise<Sale | null> {
    this._error.set(null);

    try {
      return await firstValueFrom(this.api.getById<Sale>(this.resource, id));
    } catch (err) {
      console.error('Erro ao buscar venda por ID:', err);
      this._error.set('Erro ao buscar venda');
      return null;
    }
  }
}
