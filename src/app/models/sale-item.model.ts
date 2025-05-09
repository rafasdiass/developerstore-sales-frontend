
export interface SaleItem {
  id:               string;
  productId:        string;
  productName:      string;
  quantity:         number;
  unitPrice:        number;
  discount:         number;
  totalItemAmount:  number;
  isCancelled:      boolean;
}