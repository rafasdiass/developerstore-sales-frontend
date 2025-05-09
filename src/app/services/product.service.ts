// src/app/services/products.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly resource = 'products';

  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  constructor(private api: ApiService) {
    effect(() => this.loadAll());
  }

  loadAll(): void {
    this.api.getAll<Product>(this.resource).subscribe({
      next: (list) => this._products.set(list),
      error: () => console.error('Erro ao carregar produtos'),
    });
  }
}
