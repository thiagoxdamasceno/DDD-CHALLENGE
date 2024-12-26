
import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import { OrderModel } from "../db/sequelize/model/order.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { ProductModel } from "../../product/db/sequelize/model/product.model";
import { CustomerModel } from "../../customer/db/sequelize/model/customer.model";
import { CustomerRepository } from "../../customer/repository/customer.repository";
import { Customer } from "../../../domain/customer/entity/customer";
import { Address } from "../../../domain/customer/value-object/address";
import { ProductRepository } from "../../product/repository/product.repository";
import Product from "../../../domain/product/entity/product";
import OrderItem from "../../../domain/order/entity/order_item";
import Order from "../../../domain/order/entity/order";

describe("Order repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      OrderItemModel,
      ProductModel,
      CustomerModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("123", "Customer 1");
    const address = new Address(
      "Street 1",
      123,
      "Zipcode 1",
      "City 1"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 9.9);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
          order_id: order.id,
        },
      ],
    });
  });

  it("should update an order and update an order item", async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("123", "Customer 1");
    const address = new Address(
      "Street 1",
      123,
      "Zipcode 1",
      "City 1"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 9.9);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
          order_id: order.id,
        },
      ],
    });

    const otherCustomer = new Customer("456", "Customer 2");
    const address2 = new Address(
      "Street 2",
      999,
      "Zipcode 2",
      "City 2"
    );
    otherCustomer.changeAddress(address2);
    await customerRepository.create(otherCustomer);

    const otherProduct = new Product("63", "Product 2", 29.9);
    await productRepository.create(otherProduct);

    const modifiedItem = new OrderItem(
      "1",
      otherProduct.name,
      otherProduct.price,
      otherProduct.id,
      2
    );

    const modifiedOrder = new Order("123", otherCustomer.id, [modifiedItem]);

    await orderRepository.update(modifiedOrder);

    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: "123",
      customer_id: otherCustomer.id,
      total: modifiedOrder.total(),
      items: [
        {
          id: modifiedItem.id,
          name: modifiedItem.name,
          price: modifiedItem.price,
          product_id: modifiedItem.productId,
          quantity: modifiedItem.quantity,
          order_id: order.id,
        },
      ],
    });
  });

  it("should update an order and update an order item and insert a new order item", async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("123", "Customer 1");
    const address = new Address(
      "Street 1",
      123,
      "Zipcode 1",
      "City 1"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 9.9);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
          order_id: order.id,
        },
      ],
    });

    const otherCustomer = new Customer("456", "Customer 2");
    const address2 = new Address(
      "Street 2",
      999,
      "Zipcode 2",
      "City 2"
    );
    otherCustomer.changeAddress(address2);
    await customerRepository.create(otherCustomer);

    const otherProduct = new Product("63", "Product 2", 29.9);
    await productRepository.create(otherProduct);

    const otherOrderItem = new OrderItem(
      "2",
      otherProduct.name,
      otherProduct.price,
      otherProduct.id,
      2
    );

    const modifiedOrder = new Order("123", otherCustomer.id, [
      orderItem,
      otherOrderItem,
    ]);

    await orderRepository.update(modifiedOrder);

    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel2.id).toBe(modifiedOrder.id);
    expect(orderModel2.customer_id).toBe(modifiedOrder.customerId);
    expect(orderModel2.total).toBe(modifiedOrder.total());

    expect(orderModel2.items).toHaveLength(2);

    const item1 = orderModel2.items[0];
    expect(item1.id).toBe(orderItem.id);
    expect(item1.name).toBe(orderItem.name);
    expect(item1.price).toBe(orderItem.price);
    expect(item1.product_id).toBe(orderItem.productId);
    expect(item1.quantity).toBe(orderItem.quantity);

    const item2 = orderModel2.items[1];
    expect(item2.id).toBe(otherOrderItem.id);
    expect(item2.name).toBe(otherOrderItem.name);
    expect(item2.price).toBe(otherOrderItem.price);
    expect(item2.product_id).toBe(otherOrderItem.productId);
    expect(item2.quantity).toBe(otherOrderItem.quantity);
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("123", "Customer 1");
    const address = new Address(
      "Street 1",
      123,
      "Zipcode 1",
      "City 1"
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 9.9);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(order).toStrictEqual(foundOrder);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();

    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address(
      "Street 1",
      123,
      "Zipcode 1",
      "City 1"
    );
    customer1.changeAddress(address1);
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 9.9);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order1 = new Order("123", customer1.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);

    const customer2 = new Customer("789", "Customer 2");
    const address2 = new Address(
      "Street 2",
      999,
      "Zipcode 2",
      "City 2"
    );
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const product2 = new Product("333", "Product 2", 19.9);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order2 = new Order("789", customer2.id, [orderItem2]);

    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    expect(foundOrders).toHaveLength(2);
    expect(foundOrders).toContainEqual(order1);
    expect(foundOrders).toContainEqual(order2);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("AAAAAA");
    }).rejects.toThrow("Order not found.");
  });
});