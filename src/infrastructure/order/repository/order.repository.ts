import Order from "../../../domain/order/entity/order";
import OrderItem from "../../../domain/order/entity/order_item";
import OrderRepositoryInterface from "../../../domain/order/repository/order-repository.interface";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";


export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            })),
        },
            {
                include: [
                    {
                        model: OrderItemModel
                    }
                ]
            });
    }

    async update(entity: Order): Promise<void> {

        await OrderModel.update({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => this.updateOrCreateOrderItem(entity.id, item))
        },
        {
            where: {
                id: entity.id
            }
        });
    }

    async updateOrCreateOrderItem(orderId: string, item: OrderItem): Promise<void> {
        const foundItem = await OrderItemModel.findOne({ where: { id: item.id } });
        if (!foundItem) {
            await OrderItemModel.create({
                id: item.id,
                name: item.name,
                product_id: item.productId,
                price: item.price,
                quantity: item.quantity,
                order_id: orderId
            });
        } else {
            await OrderItemModel.update({
                name: item.name,
                product_id: item.productId,
                price: item.price,
                quantity: item.quantity
            }, {
                where: { id: item.id }
            });
        }
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                rejectOnEmpty: true,
                include: [ "items" ]
            });
        } catch (error) {
            throw new Error("Order not found.");
        }
        const order = new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(item => {
                const orderItem = new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity);
                return orderItem;
            }));
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: OrderItemModel });
        const orders = orderModels.map(orderModel => {
            const order = new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map(item => {
                    const orderItem = new OrderItem(
                        item.id,
                        item.name,
                        item.price,
                        item.product_id,
                        item.quantity);
                    return orderItem;
                }));
            return order;
        });
        return orders;
    }
}