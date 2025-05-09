// src/app/discount-calculator/discount-calculator.component.ts

import { Component, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DiscountsService } from '../services/discounts.service';

@Component({
  selector: 'app-discount-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount-calculator.component.html',
  styleUrls: ['./discount-calculator.component.css'],
})
export class DiscountCalculatorComponent {
  // Controles reativos para quantidade e preço unitário
  readonly quantityControl = new FormControl<number>(1);
  readonly unitPriceControl = new FormControl<number>(0);

  constructor(private readonly discountsService: DiscountsService) {
    // Sempre que quantityControl ou unitPriceControl mudarem, dispara o cálculo
    effect(() => {
      const q = this.quantityControl.value ?? 0;
      const p = this.unitPriceControl.value ?? 0;
      if (q > 0 && p > 0) {
        this.discountsService.calculate(q, p).subscribe();
      }
    });
  }

  // Expondo os sinais do service via getters, sem usar this.discountsService em inicializadores
  get result() {
    return this.discountsService.result;
  }

  get loading() {
    return this.discountsService.loading;
  }

  get error() {
    return this.discountsService.error;
  }
}
