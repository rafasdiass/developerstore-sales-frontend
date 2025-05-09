import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/product.service';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';

@Component({
  selector: 'app-sale-item-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-item-form.component.html',
  styleUrls: ['./sale-item-form.component.scss'],
})
export class SaleItemFormComponent {
  /** índice do item dentro do array do pai */
  @Input() index!: number;

  /**
   * item completo
   * { productId, productName, quantity, unitPrice, discount, totalItemAmount }
   */
  @Input() item!: CreateSaleItemCommand & {
    discount: number;
    totalItemAmount: number;
  };

  /** emite { index, partial } quando algo muda */
  @Output()
  update = new EventEmitter<{
    index: number;
    partial: Partial<CreateSaleItemCommand>;
  }>();

  /** emite o índice quando remove */
  @Output()
  remove = new EventEmitter<number>();

  constructor(public productsService: ProductsService) {}

  /** produto selecionado */
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

  /** quantidade alterada */
  onQuantityChange(evt: Event) {
    const qty = (evt.target as HTMLInputElement).valueAsNumber;
    this.update.emit({
      index: this.index,
      partial: { quantity: qty },
    });
  }

  /** remove este item */
  onRemove() {
    this.remove.emit(this.index);
  }
}
