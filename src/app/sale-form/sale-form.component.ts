// src/app/sale-form/sale-form.component.ts
import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SaleItemFormComponent } from '../sale-item-form/sale-item-form.component';

import { SalesService } from '../services/sales.service';
import { BranchesService } from '../services/branches.service';
import { CustomersService } from '../services/customers.service';
import { DiscountsService } from '../services/discounts.service';
import { ProductsService } from '../services/product.service';

import { CreateSaleCommand } from '../models/create-sale-command.model';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';
import { DiscountResult } from '../models/discount.model';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, SaleItemFormComponent],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
})
export class SaleFormComponent implements OnInit {
  readonly saleNumber = signal<string>('');
  readonly saleDate = signal<Date>(new Date());
  readonly customerId = signal<string>('');
  readonly customerName = signal<string>('');
  readonly branchId = signal<string>('');
  readonly branchName = signal<string>('');

  /** itens já com discount e totalItemAmount */
  readonly items = signal<
    Array<CreateSaleItemCommand & { discount: number; totalItemAmount: number }>
  >([]);

  readonly submitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly canSubmit = computed(
    () =>
      this.saleNumber().trim() !== '' &&
      this.customerId().trim() !== '' &&
      this.branchId().trim() !== '' &&
      this.items().length > 0 &&
      this.items().every((it) => it.productId && it.quantity > 0)
  );

  constructor(
    private salesService: SalesService,
    private branchesService: BranchesService,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private discountsService: DiscountsService,
    private router: Router
  ) {
    // redireciona ou mostra erro depois de criar a venda
    effect(() => {
      if (this.submitting() && !this.salesService.loading()) {
        const err = this.salesService.error();
        if (err) {
          this.error.set(err);
          this.submitting.set(false);
        } else {
          this.router.navigate(['/sales']);
        }
      }
    });
  }

  ngOnInit(): void {
    this.branchesService.loadAll();
    this.customersService.loadAll();
    this.productsService.loadAll();
  }

  // helpers para template
  get branches() {
    return this.branchesService.list();
  }
  get customers() {
    return this.customersService.list();
  }

  /** adiciona linha em branco */
  addItem(): void {
    this.items.update((list) => [
      ...list,
      {
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        totalItemAmount: 0,
      },
    ]);
  }

  /** remove linha */
  removeItem(idx: number): void {
    this.items.update((list) => list.filter((_, i) => i !== idx));
  }

  /**
   * Mescla o partial vindo do filho e dispara o cálculo remoto.
   * Atualiza o desconto e total ao receber o resultado,
   * ou aplica fallback em caso de erro HTTP.
   */
  updateItem(event: {
    index: number;
    partial: Partial<CreateSaleItemCommand>;
  }): void {
    // 1) mescla alterações no array
    this.items.update((list) => {
      const clone = [...list];
      Object.assign(clone[event.index], event.partial);
      return clone;
    });

    // 2) dispara cálculo remoto
    const it = this.items()[event.index];
    this.discountsService.calculate(it.quantity, it.unitPrice).subscribe({
      next: (res: DiscountResult) => {
        // atualiza com os valores vindos do servidor
        this.items.update((list) => {
          const clone = [...list];
          clone[event.index] = {
            ...clone[event.index],
            discount: res.discount,
            totalItemAmount: res.totalPrice,
          };
          return clone;
        });
      },
      error: () => {
        // fallback: sem desconto, total = qty * unitPrice
        this.items.update((list) => {
          const clone = [...list];
          const base = clone[event.index];
          clone[event.index] = {
            ...base,
            discount: 0,
            totalItemAmount:
              Math.round(base.quantity * base.unitPrice * 100) / 100,
          };
          return clone;
        });
      },
    });
  }

  /** envia DTO final para a API */
  submit(): void {
    if (!this.canSubmit()) return;
    this.error.set(null);
    this.submitting.set(true);

    const cmd: CreateSaleCommand = {
      saleNumber: this.saleNumber(),
      saleDate: this.saleDate(),
      customerId: this.customerId(),
      customerName: this.customerName(),
      branchId: this.branchId(),
      branchName: this.branchName(),
      items: this.items(),
    };

    this.salesService.createSale(cmd);
  }

  onSaleNumberChange(value: string): void {
    this.saleNumber.set(value);
  }

  onCustomerChange(id: string): void {
    this.customerId.set(id);
    const c = this.customers.find((c) => c.id === id);
    this.customerName.set(c?.name ?? '');
  }

  onBranchChange(id: string): void {
    this.branchId.set(id);
    const b = this.branches.find((b) => b.id === id);
    this.branchName.set(b?.name ?? '');
  }
}
