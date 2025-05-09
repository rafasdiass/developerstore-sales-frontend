import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SalesService } from '../services/sales.service';
import { BranchesService } from '../services/branches.service';
import { CustomersService } from '../services/customers.service';
import { DiscountsService } from '../services/discounts.service';
import { ProductsService } from '../services/product.service';
import { CreateSaleCommand } from '../models/create-sale-command.model';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';
import { Branch } from '../models/branch.model';
import { Customer } from '../models/customer.model';
import { Product } from '../models/product.model';

type LocalSaleItem = CreateSaleItemCommand & {
  discount: number;
  totalItemAmount: number;
};

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule],
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
  readonly items = signal<LocalSaleItem[]>([]);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly canSubmit = computed(
    () =>
      this.saleNumber().trim() !== '' &&
      this.customerId().trim() !== '' &&
      this.customerName().trim() !== '' &&
      this.branchId().trim() !== '' &&
      this.branchName().trim() !== '' &&
      this.items().length > 0 &&
      this.items().every(
        (item) =>
          item.productId.trim() !== '' &&
          item.productName.trim() !== '' &&
          item.quantity > 0 &&
          item.unitPrice > 0
      )
  );

  constructor(
    private readonly salesService: SalesService,
    private readonly branchesService: BranchesService,
    private readonly customersService: CustomersService,
    private readonly discountsService: DiscountsService,
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {
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

  get branches(): Branch[] {
    return this.branchesService.list();
  }

  get customers(): Customer[] {
    return this.customersService.list();
  }

  get products(): Product[] {
    return this.productsService.products();
  }

  onSaleNumberInputEvent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.saleNumber.set(input.value);
  }

  onCustomerChangeEvent(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.customerId.set(select.value);
    const cust = this.customers.find((c) => c.id === select.value);
    this.customerName.set(cust?.name ?? '');
  }

  onBranchChangeEvent(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.branchId.set(select.value);
    const branch = this.branches.find((b) => b.id === select.value);
    this.branchName.set(branch?.name ?? '');
  }

  addItem() {
    this.items.update((items) => [
      ...items,
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

  removeItem(index: number) {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }

  updateItem(index: number, partial: Partial<LocalSaleItem>) {
    const updated = [...this.items()];
    updated[index] = { ...updated[index], ...partial };
    const item = updated[index];

    this.items.set(updated);

    if (item.quantity > 0 && item.unitPrice > 0) {
      this.discountsService.calculate(item.quantity, item.unitPrice);

      effect(() => {
        const result = this.discountsService.result();
        if (result) {
          const reUpdated = [...this.items()];
          reUpdated[index].discount = result.discount;
          reUpdated[index].totalItemAmount = result.totalPrice;
          this.items.set(reUpdated);
        }
      });
    }
  }

  onProductChange(event: Event, index: number) {
    const select = event.target as HTMLSelectElement;
    const productId = select.value;
    const product = this.products.find((p) => p.id === productId);
    this.updateItem(index, {
      productId,
      productName: product?.name ?? '',
    });
  }

  onQuantityChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    this.updateItem(index, { quantity: value });
  }

  onUnitPriceChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    this.updateItem(index, { unitPrice: value });
  }

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
      items: this.items().map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    this.salesService.createSale(cmd);
  }
}
