import { Customer } from '../../entity/customer'
import { Address } from '../../value-object/address'
import { CustomerCreatedEvent } from '../customer-created.event'
import { EnviaConsoleLogHandler } from './envia-console-log.handler'
import { EnviaConsoleLog1Handler } from './envia-console-log1.handler'
import { EnviaConsoleLog2Handler } from './envia-console-log2.handler'

describe('Customer event handler unit test', () => {
  let consoleLogSpy: any

  beforeEach(() => (consoleLogSpy = jest.spyOn(console, 'log')))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Send console log 1 when customer is created', () => {
    const customer = new Customer('c1', 'Customer 1')
    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    new EnviaConsoleLog1Handler().handle(customerCreatedEvent)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Esse é o primeiro console.log do evento: CustomerCreated'
    )
  })

  it('Send console log 2 when customer is created', () => {
    const customer = new Customer('c1', 'customer1')
    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    new EnviaConsoleLog2Handler().handle(customerCreatedEvent)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Esse é o segundo console.log do evento: CustomerCreated'
    )
  })

  it('Send console log when customer address is changed', () => {
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    console.log(address)
    customer.changeAddress(address)
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      address: {
        street: address.street,
        number: address.number,
        zipcode: address.zipcode,
        city: address.city
      }
    })

    new EnviaConsoleLogHandler().handle(
      customerCreatedEvent
    )

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address.street}, ${customer.address.number}, ${customer.address.zipcode}, ${customer.address.city}`
    )
  })
})