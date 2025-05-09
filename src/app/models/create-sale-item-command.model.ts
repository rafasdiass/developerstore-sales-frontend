/**
 * Payload para criação de um item de venda.
 */
export interface CreateSaleItemCommand {
  /** ID do produto */
  productId: string;
  /** Nome do produto */
  productName: string;
  /** Quantidade vendida (deve ser > 0) */
  quantity: number;
  /** Preço unitário (deve ser > 0) */
  unitPrice: number;
}
