import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
          const product = new Product("", "Product 1", 9.99);
        }).toThrow("Id is required.")
    });

    it("should throw error when name is empty", () => {
        expect(() => {
          const product = new Product("1", "", 9.99);
        }).toThrow("Name is required.")
    });

    it("should throw error when price is less than zero", () => {
        expect(() => {
          const product = new Product("1", "Product 1", -1);
        }).toThrow("Price must be greater than zero.")
    });

    it("should change name", () => {
        const product = new Product("123", "Product 1", 99.99);
        
        product.changeName("Product 2");
        
        expect(product.name).toBe("Product 2");
    });

    it("should change price", () => {
        const product = new Product("123", "Product 1", 99.99);
        
        product.changePrice(6.99);
        
        expect(product.price).toBe(6.99);
    });
});