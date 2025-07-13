export class ThresholdDiscount {
  constructor(
    public threshold: number,
    public discount: number
  ) {}
}

export class BuyOneGetOnePromotion {
  constructor(
    public category: string,
    public isActive: boolean = true
  ) {}
}

export class DoubleElevenPromotion {
  constructor(
    public isActive: boolean = true,
    public bulkDiscountThreshold: number = 10,
    public bulkDiscountRate: number = 0.2
  ) {}
} 