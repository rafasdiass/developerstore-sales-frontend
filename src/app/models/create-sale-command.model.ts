import { CreateSaleItemCommand } from './create-sale-item-command.model';

/**
 * Payload para criação de uma venda.
 */
export interface CreateSaleCommand {
  /** Número identificador da venda */
  saleNumber: string;
  /** Data e hora da venda */
  saleDate: Date;
  /** ID do cliente */
  customerId: string;
  /** Nome do cliente */
  customerName: string;
  /** ID da filial */
  branchId: string;
  /** Nome da filial */
  branchName: string;
  /** Itens que compõem a venda */
  items: CreateSaleItemCommand[];
}
