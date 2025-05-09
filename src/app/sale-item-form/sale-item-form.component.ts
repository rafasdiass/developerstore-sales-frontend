// src/app/sale-item-form/sale-item-form.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../services/product.service';
import { DiscountsService } from '../services/discounts.service';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';

/**
 * Extensão do comando original, incluindo estado local de desconto e total
 */
export interface SaleItem extends CreateSaleItemCommand {
  discount: number;
  totalItemAmount: number;
}

/**
 * Quando o componente emite, além dos campos do comando, pode vir desconto e total
 */
export type SaleItemUpdate = Partial<CreateSaleItemCommand> &
  Partial<Pick<SaleItem, 'discount' | 'totalItemAmount'>>;

@Component({
  selector: 'app-sale-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-item-form.component.html',
  styleUrls: ['./sale-item-form.component.scss'],
})
export class SaleItemFormComponent {
  @Input() index!: number;
  @Input() item!: SaleItem;

  @Output() update = new EventEmitter<{
    index: number;
    partial: SaleItemUpdate;
  }>();
  @Output() remove = new EventEmitter<number>();

  constructor(
    public productsService: ProductsService,
    private discountsService: DiscountsService
  ) {}

  /** Agora recebe diretamente o productId */
  onProductChange(productId: string) {
    // busca o produto pelo id
    const prod = this.productsService
      .products()
      .find((p) => p.id === productId);

    // 1) Atualiza localmente para manter o <select> marcado
    this.item.productId = productId;
    this.item.productName = prod?.name ?? '';
    this.item.unitPrice = prod?.price ?? 0;

    // 2) Emite para o componente pai
    this.update.emit({
      index: this.index,
      partial: {
        productId: this.item.productId,
        productName: this.item.productName,
        unitPrice: this.item.unitPrice,
      },
    });

    // 3) Recalcula desconto e total
    this.recalculate();
  }

  onQuantityChange(evt: Event) {
    const qty = (evt.target as HTMLInputElement).valueAsNumber;
    this.item.quantity = qty;
    this.update.emit({ index: this.index, partial: { quantity: qty } });
    this.recalculate();
  }

  private recalculate() {
    const { quantity: qty, unitPrice: price } = this.item;
    if (qty > 0 && price > 0) {
      this.discountsService.calculate(qty, price).subscribe((res) => {
        this.item.discount = res.discount;
        this.item.totalItemAmount = qty * price - res.discount;
        this.update.emit({
          index: this.index,
          partial: {
            discount: this.item.discount,
            totalItemAmount: this.item.totalItemAmount,
          },
        });
      });
    } else {
      this.item.discount = 0;
      this.item.totalItemAmount = 0;
    }
  }

  onRemove() {
    this.remove.emit(this.index);
  }
}
