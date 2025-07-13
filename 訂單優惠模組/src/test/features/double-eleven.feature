@double_eleven_promotion
Feature: Double Eleven Promotion
  As a shopper during Double Eleven sale
  I want to get bulk discount for same products
  So that I can save money when buying multiple items of the same product

  Background:
    Given the Double Eleven promotion is active

  Scenario: Buy 12 pieces of same product - partial bulk discount
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | 襪子          | 12       | 100       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 1200           | 200      | 1000        |
    And the customer should receive:
      | productName | quantity |
      | 襪子          | 12       |

  Scenario: Buy 27 pieces of same product - multiple bulk discounts
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | 襪子          | 27       | 100       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 2700           | 400      | 2300        |
    And the customer should receive:
      | productName | quantity |
      | 襪子          | 27       |

  Scenario: Buy 10 pieces of different products - no bulk discount
    When a customer places an order with:
      | productName | quantity | unitPrice |
      | 商品A         | 1        | 100       |
      | 商品B         | 1        | 100       |
      | 商品C         | 1        | 100       |
      | 商品D         | 1        | 100       |
      | 商品E         | 1        | 100       |
      | 商品F         | 1        | 100       |
      | 商品G         | 1        | 100       |
      | 商品H         | 1        | 100       |
      | 商品I         | 1        | 100       |
      | 商品J         | 1        | 100       |
    Then the order summary should be:
      | originalAmount | discount | totalAmount |
      | 1000           | 0        | 1000        |
    And the customer should receive:
      | productName | quantity |
      | 商品A         | 1        |
      | 商品B         | 1        |
      | 商品C         | 1        |
      | 商品D         | 1        |
      | 商品E         | 1        |
      | 商品F         | 1        |
      | 商品G         | 1        |
      | 商品H         | 1        |
      | 商品I         | 1        |
      | 商品J         | 1        | 