// src/app/sale-item-form/sale-item-form.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/product.service';
import { DiscountsService } from '../services/discounts.service';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';

/**
 * Extensão do comando para incluir estado local de desconto e total.
 */
export interface SaleItem extends CreateSaleItemCommand {
  discount: number;
  totalItemAmount: number;
}

/**
 * Tipo usado no emitter: propriedades do comando + desconto/total.
 */
export type SaleItemUpdate = Partial<CreateSaleItemCommand> &
  Partial<Pick<SaleItem, 'discount' | 'totalItemAmount'>>;

@Component({
  selector: 'app-sale-item-form',
  standalone: true,
  imports: [
    CommonModule, // removido DiscountCalculatorComponent, pois não está no template
  ],
  templateUrl: './sale-item-form.component.html',
  styleUrls: ['./sale-item-form.component.scss'],
})
export class SaleItemFormComponent {
  @Input() index!: number;
  @Input() item!: SaleItem;

  @Output()
  update = new EventEmitter<{ index: number; partial: SaleItemUpdate }>();

  @Output()
  remove = new EventEmitter<number>();

  // Torna o serviço público para ser acessível no template
  constructor(
    public productsService: ProductsService,
    private discountsService: DiscountsService
  ) {}

  onProductChange(evt: Event) {
    const select = evt.target as HTMLSelectElement;
    const productId = select.value;
    const prod = this.productsService
      .products()
      .find((p) => p.id === productId);

    this.update.emit({
      index: this.index,
      partial: {
        productId,
        productName: prod?.name ?? '',
        unitPrice: prod?.price ?? 0,
      },
    });
  }

  onQuantityChange(evt: Event) {
    const qty = (evt.target as HTMLInputElement).valueAsNumber;

    // Emite a mudança de quantidade
    this.update.emit({
      index: this.index,
      partial: { quantity: qty },
    });

    // Dispara cálculo de desconto e emite desconto + total atualizado
    const price = this.item.unitPrice;
    if (qty > 0 && price > 0) {
      this.discountsService.calculate(qty, price).subscribe((res) => {
        this.update.emit({
          index: this.index,
          partial: {
            discount: res.discount,
            totalItemAmount: qty * price - res.discount,
          },
        });
      });
    }
  }

  onRemove() {
    this.remove.emit(this.index);
  }
}
