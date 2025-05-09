import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';
import { Product } from '../models/product.model';

import { ProductsService } from '../services/product.service';
import { DiscountsService } from '../services/discounts.service';

@Component({
  selector: 'app-sale-item-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-item-form.component.html',
  styleUrls: ['./sale-item-form.component.scss'],
})
export class SaleItemFormComponent implements OnInit {
  @Input() index!: number;
  @Input() item!: CreateSaleItemCommand;

  @Output() update = new EventEmitter<{
    index: number;
    partial: Partial<CreateSaleItemCommand>;
  }>();
  @Output() remove = new EventEmitter<number>();

  private readonly productsService = inject(ProductsService);
  private readonly discountsService = inject(DiscountsService);

  readonly products = signal<Product[]>([]);
  readonly discount = signal<number>(0);

  readonly totalItemAmount = computed(() => {
    const total = this.item.quantity * this.item.unitPrice;
    return total - this.discount();
  });

  ngOnInit(): void {
    // Garante que os produtos estejam carregados
    if (this.productsService.products().length === 0) {
      this.productsService.loadAll();
    }

    effect(() => {
      const loaded = this.productsService.products();
      if (loaded.length > 0) {
        this.products.set(loaded);
      }
    });

    effect(() => {
      const product = this.products().find((p) => p.id === this.item.productId);
      if (product) {
        this.update.emit({
          index: this.index,
          partial: {
            productName: product.name,
            unitPrice: product.price,
          },
        });
      }
    });

    effect(() => {
      const { quantity, unitPrice } = this.item;
      if (quantity > 0 && unitPrice > 0) {
        this.discountsService.calculate(quantity, unitPrice);
      }
    });

    effect(() => {
      const res = this.discountsService.result();
      if (res) {
        this.discount.set(res.discount);
      }
    });
  }

  onProductSelect(productId: string) {
    this.update.emit({
      index: this.index,
      partial: { productId },
    });
  }

  onQuantityInput(value: number) {
    this.update.emit({
      index: this.index,
      partial: { quantity: value },
    });
  }

  getEventValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  getEventValueAsNumber(event: Event): number {
    return (event.target as HTMLInputElement).valueAsNumber;
  }

  onRemove() {
    this.remove.emit(this.index);
  }
}
