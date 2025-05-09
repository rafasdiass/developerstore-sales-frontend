import { SaleItem } from './sale-item.model';

/**
 * Representa uma venda no frontend, espelhando a estrutura do DTO retornado pela API.
 */
export interface Sale {
  id: string;
  saleNumber: string;
  saleDate: string; // ISO 8601 (ex: "2025-05-09T14:00:00")
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  isCancelled: boolean;
  totalAmount: number;
  items: SaleItem[];
}
