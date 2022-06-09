const { expect } = require('chai')
const ExternalDevice = require('../lib/externaldevice')

let status = {}

const mockRedisClient = {
  sendCommand: async (command) => {
    const key = command[0]
    const value = command[1]
    status.key = key
    status.value = value
    return value
  }
}

const mockRedisClientRejector = {
  sendCommand: async (command) => {
    const key = command[0]
    const value = command[1]
    status.key = key
    status.value = value
    throw (new Error('REJECT ERROR'))
  }
}

describe('the ExternalDevice class', () => {
  let device
  beforeEach(() => {
    device = new ExternalDevice({})
    clearInterval(device.reader)
  })
  describe('when the lastResult getter method is called', () => {
    it('should return "Queue Empty" if there\'s no data', () => {
      const result = device.lastResult
      expect(result).to.equal('Queue Empty')
    })
    it('should return the last item in the queue if there is data', () => {
      device.lastData = ['bob', 'bill', 'ben']
      const result = device.lastResult
      expect(result).to.equal('ben')
    })
  })
  describe('when the hasData getter method is called', () => {
    it('should return true if there is data in the queue', () => {
      device.lastData = ['bob', 'bill', 'ben']
      const result = device.hasData
      expect(result).to.equal(true)
    })
    it('should return false if there is data in the queue', () => {
      device.lastData = []
      const result = device.hasData
      expect(result).to.equal(false)
    })
  })
  describe('when addData() is called', () => {
    it('should add a timestamp to data before adding it to the queue', () => {
      device.addData('bob')
      const result = device.lastResult
      expect('timeStamp' in result).to.equal(true)
    })
    it('should add data to the end of the queue', () => {
      device.addData('bob')
      const result = device.lastResult
      expect(result.data).to.equal('bob')
    })
    it('should drop the first item from the queue if the queue length exceeds the max queueSize', () => {
      for (let i = 0; i < 20; i++) {
        device.addData(`data${i}`)
      }
      expect(device.lastData.length).to.equal(device.queueSize)
    })
  })
  describe('when the queueReader is called successfully', () => {
    beforeEach(() => {
      status = {}
      device = new ExternalDevice({
        redisClient: mockRedisClient
      })
      clearInterval(device.reader)
    })
    it('should call the redisClient.sendCommand() method', async () => {
      await device.queueReader()
      expect(status.key).to.equal('GETDEL')
      expect(status.value).to.equal('DEFAULT-DATA')
    })
  })
  describe('when the queueReader is called UNsuccessfully', () => {
    let store
    beforeEach(() => {
      status = {}
      store = {}
      const mockStore = {
        append: (storeName, value) => {
          store[storeName] = value
        }
      }
      device = new ExternalDevice({
        redisClient: mockRedisClientRejector,
        store: mockStore
      })
      clearInterval(device.reader)
    })
    it('should call the redisClient.sendCommand() method', async () => {
      await device.queueReader()
      expect(store.ERRORS.errorName).to.equal('REDIS_CLIENT_GETDEL_DATA_ERROR')
    })
  })
})
