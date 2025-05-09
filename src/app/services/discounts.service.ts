// src/app/services/discounts.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { DiscountResult } from '../models/discount.model';
import { catchError, tap, finalize } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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

  /**
   * Dispara GET /api/discounts?quantity=...&unitPrice=...
   * Retorna um Observable<DiscountResult> puro — em caso de falha,
   * atualiza _error e completa via EMPTY, disparando o error() do subscribe.
   */
  calculate(quantity: number, unitPrice: number): Observable<DiscountResult> {
    this._loading.set(true);
    this._error.set(null);

    return this.api
      .get<DiscountResult>('discounts', { quantity, unitPrice })
      .pipe(
        tap((res) => this._result.set(res)),
        catchError((err: HttpErrorResponse) => {
          // mensagem do servidor, se houver
          const msg =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message ?? 'Erro ao calcular desconto';
          this._error.set(msg);
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      );
  }
}
