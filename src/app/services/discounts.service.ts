// src/app/services/discounts.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { DiscountResult } from '../models/discount.model';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DiscountsService {
  private readonly _result = signal<DiscountResult | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly result = this._result.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasResult = computed(() => !!this._result());

  constructor(private readonly api: ApiService) {}

  calculate(quantity: number, unitPrice: number) {
    this._loading.set(true);
    this._error.set(null);

    return this.api
      .get<DiscountResult>('discounts', { quantity, unitPrice })
      .pipe(
        tap((res: DiscountResult) => {
          this._result.set(res);
        }),
        catchError((err) => {
          this._error.set('Erro ao calcular desconto');
          return EMPTY;
        }),
        tap(() => this._loading.set(false))
      );
  }
}
