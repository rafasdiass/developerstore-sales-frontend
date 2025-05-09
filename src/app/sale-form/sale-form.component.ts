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
  readonly saleNumber = signal('');
  readonly saleDate = signal(new Date());
  readonly customerId = signal('');
  readonly customerName = signal('');
  readonly branchId = signal('');
  readonly branchName = signal('');

  /** itens já com discount e totalItemAmount */
  readonly items = signal<
    Array<CreateSaleItemCommand & { discount: number; totalItemAmount: number }>
  >([]);

  readonly submitting = signal(false);
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
    // quando terminar de submeter, redireciona ou mostra erro
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
  addItem() {
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
  removeItem(idx: number) {
    this.items.update((list) => list.filter((_, i) => i !== idx));
  }

  /**
   * recebe do filho {index, partial}, aplica no array, chama backend p/ desconto e atualiza
   */
  updateItem(event: {
    index: number;
    partial: Partial<CreateSaleItemCommand>;
  }) {
    // passo 1: funde partial
    this.items.update((list) => {
      const clone = [...list];
      Object.assign(clone[event.index], event.partial);
      return clone;
    });

    // passo 2: disparar cálculo remoto
    const it = this.items()[event.index];
    this.discountsService.calculate(it.quantity, it.unitPrice).subscribe({
      next: (res: DiscountResult) => {
        this.items.update((list) => {
          const c = [...list];
          c[event.index] = {
            ...c[event.index],
            discount: res.discount,
            totalItemAmount: res.totalPrice,
          };
          return c;
        });
      },
      error: () => {
        // em caso de erro, zera desconto e total = qty * unitPrice
        this.items.update((list) => {
          const c = [...list];
          const base = c[event.index];
          c[event.index] = {
            ...base,
            discount: 0,
            totalItemAmount:
              Math.round(base.quantity * base.unitPrice * 100) / 100,
          };
          return c;
        });
      },
    });
  }

  /** envia DTO final para a API */
  submit() {
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
 

  onSaleNumberChange(value: string) {
    this.saleNumber.set(value);
  }

  onCustomerChange(id: string) {
    this.customerId.set(id);
    const c = this.customers.find((c) => c.id === id);
    this.customerName.set(c?.name ?? '');
  }

  onBranchChange(id: string) {
    this.branchId.set(id);
    const b = this.branches.find((b) => b.id === id);
    this.branchName.set(b?.name ?? '');
  }
}
