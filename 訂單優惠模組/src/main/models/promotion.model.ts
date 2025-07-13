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