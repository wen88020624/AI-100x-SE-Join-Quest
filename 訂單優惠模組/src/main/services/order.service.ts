import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.model';
import { Order, OrderSummary, OrderItem } from '../models/order.model';
import { ThresholdDiscount, BuyOneGetOnePromotion } from '../models/promotion.model';

@Injectable()
export class OrderService {
  private thresholdDiscount: ThresholdDiscount | null = null;
  private buyOneGetOnePromotion: BuyOneGetOnePromotion | null = null;

  setThresholdDiscount(threshold: number, discount: number): void {
    this.thresholdDiscount = new ThresholdDiscount(threshold, discount);
  }

  setBuyOneGetOnePromotion(category: string): void {
    this.buyOneGetOnePromotion = new BuyOneGetOnePromotion(category);
  }

  clearPromotions(): void {
    this.thresholdDiscount = null;
    this.buyOneGetOnePromotion = null;
  }

  calculateOrder(products: Product[]): Order {
    // 計算原始金額
    const originalAmount = products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);
    
    // 計算優惠
    let discount = 0;
    
    // 應用滿額折扣
    if (this.thresholdDiscount && originalAmount >= this.thresholdDiscount.threshold) {
      discount = this.thresholdDiscount.discount;
    }
    
    // 計算最終金額
    const totalAmount = originalAmount - discount;
    
    // 計算訂單項目（包含買一送一優惠）
    const items = this.calculateOrderItems(products);
    
    return new Order(
      products,
      new OrderSummary(originalAmount, discount, totalAmount),
      items
    );
  }

  private calculateOrderItems(products: Product[]): OrderItem[] {
    const items: OrderItem[] = [];
    
    for (const product of products) {
      let quantity = product.quantity;
      
      // 應用買一送一優惠 - 對於每種化妝品商品，如果有購買，就再送 1 件
      if (this.buyOneGetOnePromotion && 
          this.buyOneGetOnePromotion.isActive && 
          product.category === this.buyOneGetOnePromotion.category) {
        quantity = quantity + 1;
      }
      
      items.push(new OrderItem(product.productName, quantity));
    }
    
    return items;
  }
} 