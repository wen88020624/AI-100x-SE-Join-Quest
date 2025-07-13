import { Product } from './product.model';

export class OrderSummary {
  constructor(
    public originalAmount: number,
    public discount: number,
    public totalAmount: number
  ) {}
}

export class OrderItem {
  constructor(
    public productName: string,
    public quantity: number
  ) {}
}

export class Order {
  constructor(
    public products: Product[],
    public summary: OrderSummary,
    public items: OrderItem[]
  ) {}
} 