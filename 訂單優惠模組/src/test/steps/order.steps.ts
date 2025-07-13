import { Given, When, Then, Before } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { OrderService } from '../../main/services/order.service';
import { Product } from '../../main/models/product.model';
import { Order } from '../../main/models/order.model';

let orderService: OrderService;
let currentOrder: Order;

Before(function () {
  orderService = new OrderService();
});

Given('no promotions are applied', function () {
  orderService.clearPromotions();
});

Given('the threshold discount promotion is configured:', function (dataTable) {
  const row = dataTable.hashes()[0];
  orderService.setThresholdDiscount(parseInt(row.threshold), parseInt(row.discount));
});

Given('the buy one get one promotion for cosmetics is active', function () {
  orderService.setBuyOneGetOnePromotion('cosmetics');
});

Given('the Double Eleven promotion is active', function () {
  orderService.setDoubleElevenPromotion();
});

When('a customer places an order with:', function (dataTable) {
  const products: Product[] = [];
  const rows = dataTable.hashes();
  
  for (const row of rows) {
    const product = new Product(
      row.productName,
      row.category || 'default',
      parseInt(row.quantity),
      parseInt(row.unitPrice)
    );
    products.push(product);
  }
  
  currentOrder = orderService.calculateOrder(products);
});

Then('the order summary should be:', function (dataTable) {
  const expectedRow = dataTable.hashes()[0];
  
  if (expectedRow.totalAmount) {
    assert.equal(currentOrder.summary.totalAmount, parseInt(expectedRow.totalAmount));
  }
  
  if (expectedRow.originalAmount) {
    assert.equal(currentOrder.summary.originalAmount, parseInt(expectedRow.originalAmount));
  }
  
  if (expectedRow.discount) {
    assert.equal(currentOrder.summary.discount, parseInt(expectedRow.discount));
  }
});

Then('the customer should receive:', function (dataTable) {
  const expectedItems = dataTable.hashes();
  
  assert.equal(currentOrder.items.length, expectedItems.length);
  
  for (let i = 0; i < expectedItems.length; i++) {
    const expectedItem = expectedItems[i];
    const actualItem = currentOrder.items[i];
    
    assert.equal(actualItem.productName, expectedItem.productName);
    assert.equal(actualItem.quantity, parseInt(expectedItem.quantity));
  }
}); 