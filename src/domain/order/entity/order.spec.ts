import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            const order = new Order("", "123", []);
        }).toThrow("Id is required.")
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            const order = new Order("1", "", []);
        }).toThrow("CustomerId is required.")
    });


    it("should throw error when items is empty", () => {
        expect(() => {
            const order = new Order("1", "123", []);
        }).toThrow("Items are required.")
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("i1", "Item 1", 9.69, "p1", 2);
        const order1 = new Order("o1", "123", [ item1 ]);

        let total = order1.total();

        expect(total).toBe(19.38);

        const item2 = new OrderItem("i2", "Item 2", 9.69, "p2", 2);
        const order2 = new Order("o2", "123", [ item1, item2 ]);

        total = order2.total();

        expect(total).toBe(38.76);

    });

    it("should throw error if the item quantity is less or equal to 0", () => {

        expect(() => {
            const item = new OrderItem("i1", "Item 1", 9.99, "p1", 0);  
            const order = new Order("1", "123", [ item ]);
        }).toThrow("Item quantity must be greater than 0.")

    });
});