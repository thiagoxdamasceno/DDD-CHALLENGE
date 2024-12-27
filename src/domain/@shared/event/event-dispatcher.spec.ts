import { CustomerAddressChangedEvent } from "../../customer/event/customer-address-changed.event"
import { EnviaConsoleLogHandler } from "../../customer/event/handler/envia-console-log.handler"
import { EnviaConsoleLog1Handler } from "../../customer/event/handler/envia-console-log1.handler"
import { EnviaConsoleLog2Handler } from "../../customer/event/handler/envia-console-log2.handler"
import { SendEmailWhenProductIsCreatedHandler } from "../../product/event/handler/send-email-when-product-is-created.handler"
import ProductCreatedEvent from "../../product/event/product-created.event"
import EventDispatcher from "./event-dispatcher"

describe('Domain events tests', () => {
  it('it should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler)
  })

  it('it should register event handlers', () => {
    const eventDispatcher = new EventDispatcher()

    const eventHandlerLog = new EnviaConsoleLogHandler()
    const eventHandlerLog1 = new EnviaConsoleLog1Handler()
    const eventHandlerLog2 = new EnviaConsoleLog2Handler()
    
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandlerLog)
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerLog1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerLog2)

    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(eventHandlerLog)

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandlerLog1)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandlerLog2)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0)
  })

  it('should unregister all events', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    const eventHandlerLog = new EnviaConsoleLogHandler()
    const eventHandlerLog1 = new EnviaConsoleLog1Handler()
    const eventHandlerLog2 = new EnviaConsoleLog2Handler()
   

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    eventDispatcher.register('CustomerAddressChangedEvent', eventHandlerLog)
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerLog1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerLog2)

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined()
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')
    const eventHandlerLog = new EnviaConsoleLogHandler()
    const spyEventHandlerLog = jest.spyOn(eventHandlerLog, 'handle')

    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandlerLog)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(eventHandlerLog)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'p1',
      description: 'Product 1',
      price: 10.0
    })

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: 'c1',
      name: 'Customer 1',
      address: {
        street: 'Street 1',
        number: 1,
        zipcode: 'Zipcode 1',
        city: 'City 1'
      }
    })

    eventDispatcher.notify(productCreatedEvent)
    expect(spyEventHandler).toHaveBeenCalled()
    eventDispatcher.notify(customerAddressChangedEvent)
    expect(spyEventHandlerLog).toHaveBeenCalled()
  })
})