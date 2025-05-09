// src/app/sales-list/sales-list.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { effect } from '@angular/core';
import { SalesService } from '../services/sales.service';


@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss'],
})
export class SalesListComponent {
  constructor(private salesService: SalesService) {
    // opcional: log de erros quando mudarem
    effect(() => {
      const err = this.error;
      if (err) {
        console.error(err);
      }
    });
  }

  // getters leem os signals do serviço — sem uso de property initializers
  get sales() {
    return this.salesService.sales();
  }
  get loading() {
    return this.salesService.loading();
  }
  get error() {
    return this.salesService.error();
  }
  get hasSales() {
    return this.salesService.hasSales();
  }

  deleteSale(id: string): void {
    if (!confirm('Confirma exclusão desta venda?')) return;
    this.salesService.deleteSale(id);
  }
}
