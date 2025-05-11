export interface UpdateSaleCommand {
  id: string;
  saleDate?: string;
  customerId?: string;
  customerName?: string;
  branchId?: string;
  branchName?: string;
  items?: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}
