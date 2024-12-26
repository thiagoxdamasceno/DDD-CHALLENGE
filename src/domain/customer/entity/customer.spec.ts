/* eslint-disable no-unused-vars */
import { Address } from "../value-object/address";
import { Customer } from "./customer";

describe("Customer unit tests", () => {

  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "Thiago");
    }).toThrow("Id is required.");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrow("Name is required.");
  });

  it("should change name", () => {
    const customer = new Customer("123", "Thiago");
    customer.changeName("Thiagodm")

    expect(customer.name).toBe("Thiagodm");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "11111-001", "City 1");
    customer.changeAddress(address)

    customer.activate()

    expect(customer.isActive()).toBe(true)
  });

  it('should deactivate customer', () => {
    const customer = new Customer('123', 'Thiago')

    customer.deactivate()

    expect(customer.isActive()).toBe(false)
  })

  it('should throw error when address is undefined when you activate a customer', () => {
    expect(() => {
      const customer = new Customer('123', 'Thiago')

      customer.activate()
    }).toThrow('Address is mandatory to activate a customer.')
  })

  it('should add reward points', () => {
    const customer = new Customer('1', 'Customer 1')
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(10)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(20)
  })

});