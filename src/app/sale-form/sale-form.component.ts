// src/app/sale-form/sale-form.component.ts

import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchesService } from '../services/branches.service';
import { CustomersService } from '../services/customers.service';
import { DiscountsService } from '../services/discounts.service';
import { ProductsService } from '../services/product.service';
import { SalesService } from '../services/sales.service';
import { Sale } from '../models/sale.model';
import { DiscountResult } from '../models/discount.model';
import { CreateSaleItemCommand } from '../models/create-sale-item-command.model';
import { UpdateSaleCommand } from '../models/update-sale-command.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class SaleFormComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;
  isEditMode = false;
  saleId: string | null = null;

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Venda' : 'Nova Venda';
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private salesService: SalesService,
    public customersService: CustomersService,
    public branchesService: BranchesService,
    public productsService: ProductsService,
    private discountsService: DiscountsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      saleDate: [new Date(), Validators.required],
      customerId: ['', Validators.required],
      customerName: ['', Validators.required],
      branchId: ['', Validators.required],
      branchName: ['', Validators.required],
      items: this.fb.array([]),
    });

    this.customersService.loadAll();
    this.branchesService.loadAll();
    this.productsService.loadAll();

    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.saleId = id;

        try {
          const sale = await this.salesService.getById(id);
          if (!sale) {
            this.error = 'Venda não encontrada.';
            return;
          }
          this.populateForm(sale);
        } catch (err) {
          console.error('Erro ao buscar venda para edição:', err);
          this.error = 'Erro ao carregar venda para edição.';
        }
      } else {
        this.isEditMode = false;
        this.saleId = null;
        this.addItem(); // criação
      }
    });
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0],
      totalItemAmount: [0],
      isCancelled: [false],
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onProductChange(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('productId')?.value;
    const product = this.productsService
      .products()
      .find((p) => p.id === productId);

    item.patchValue({
      productName: product?.name ?? '',
      unitPrice: product?.price ?? 0,
    });

    this.recalculate(index);
  }

  onCustomerChange(): void {
    const id = this.form.get('customerId')?.value;
    const customer = this.customersService.list().find((c) => c.id === id);
    this.form.get('customerName')?.setValue(customer?.name ?? '');
  }

  onBranchChange(): void {
    const id = this.form.get('branchId')?.value;
    const branch = this.branchesService.list().find((b) => b.id === id);
    this.form.get('branchName')?.setValue(branch?.name ?? '');
  }

  recalculate(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value;
    const price = item.get('unitPrice')?.value;

    if (quantity > 0 && price > 0) {
      this.discountsService.calculate(quantity, price).subscribe({
        next: (res: DiscountResult) => {
          item.patchValue({
            discount: res.discount,
            totalItemAmount:
              Math.round((quantity * price - res.discount) * 100) / 100,
          });
        },
        error: () => {
          item.patchValue({
            discount: 0,
            totalItemAmount: Math.round(quantity * price * 100) / 100,
          });
        },
      });
    } else {
      item.patchValue({ discount: 0, totalItemAmount: 0 });
    }
  }

  populateForm(sale: Sale): void {
    this.form.patchValue({
      saleDate: sale.saleDate,
      customerId: sale.customerId,
      customerName: sale.customerName,
      branchId: sale.branchId,
      branchName: sale.branchName,
    });

    sale.items.forEach((item) => {
      this.items.push(
        this.fb.group({
          productId: [item.productId, Validators.required],
          productName: [item.productName, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
          discount: [item.discount],
          totalItemAmount: [item.totalItemAmount],
          isCancelled: [item.isCancelled],
        })
      );
    });
  }
  submit(): void {
    if (this.form.invalid) return;

    const dto = this.form.value;
    const payload = {
      saleDate: dto.saleDate,
      customerId: dto.customerId,
      customerName: dto.customerName,
      branchId: dto.branchId,
      branchName: dto.branchName,
      items: dto.items.map((it: CreateSaleItemCommand) => ({
        productId: it.productId,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    };

    if (this.isEditMode && this.saleId) {
      const update: UpdateSaleCommand = {
        id: this.saleId,
        ...payload,
      };

      this.salesService
        .updateSale(this.saleId, update)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Venda atualizada!',
            text: 'A venda foi atualizada com sucesso.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: '#f8f9fa',
          }).then(() => this.router.navigate(['/sales']));
        })
        .catch((err) => {
          this.error = 'Erro ao atualizar a venda.';
          console.error(err);
        });
    } else {
      this.salesService
        .createSale(payload)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Venda criada!',
            text: 'A nova venda foi registrada com sucesso.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: '#f8f9fa',
          }).then(() => this.router.navigate(['/sales']));
        })
        .catch((err) => {
          this.error = 'Erro ao criar a venda.';
          console.error(err);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }
}
