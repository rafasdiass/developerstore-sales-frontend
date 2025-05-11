import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { signal, effect } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss'],
})
export class SaleDetailComponent {
  readonly sale = signal<Sale | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly salesService: SalesService
  ) {
    effect(() => {
      const isEditPath = this.router.url.includes('/edit');
      if (!isEditPath) {
        this.loadSale();
      }
    });
  }

  private async loadSale(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID da venda não fornecido');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.salesService.getById(id);
      if (!result) {
        this.error.set('Venda não encontrada');
        this.sale.set(null);
      } else {
        this.sale.set(result);
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes da venda:', err);
      this.error.set('Erro ao carregar detalhes');
    } finally {
      this.loading.set(false);
    }
  }
  goToEdit(): void {
    const current = this.sale();
    if (current?.id) {
      this.router.navigate(['/sales', current.id, 'edit']);
    }
  }
  goBack(): void {
    this.router.navigate(['/sales']);
  }
}
