const { expect } = require('chai')
const DepthAI = require('../lib/depthai')

let status = {}

const mockRedisClient = {
  set: async (key, value) => {
    status.key = key
    status.value = value
  }
}

const mockRedisClientRejector = {
  set: async (key, value) => {
    status.key = key
    status.value = value
    throw (new Error('REJECT ERROR'))
  }
}

const store = {}

const mockStore = {
  append: (storeName, value) => {
    store[storeName] = value
  }
}

describe('the DepthAI class', () => {
  let depthai
  let depthaiReject
  beforeEach(() => {
    status = {}
    depthai = new DepthAI({ redisClient: mockRedisClient })
    depthaiReject = new DepthAI({ redisClient: mockRedisClientRejector, store: mockStore })
    clearInterval(depthai.reader)
    clearInterval(depthaiReject.reader)
  })
  describe('when the getDistance() method is called', () => {
    it('should call the redisClient.set method with the GETDISTANCE request', () => {
      depthai.getDistance()
      expect(status).to.deep.equal({ key: 'DEPTHAI-REQ', value: 'GETDISTANCE' })
    })
    it('should log an error if it fails', async () => {
      await depthaiReject.getDistance()
      expect(store.ERRORS.errorName).to.equal('REDIS_CLIENT_SET_DATA_ERROR')
      expect(store.ERRORS.moduleName).to.equal('depthai:getDistance')
    })
  })
  describe('when the getObjectList() method is called', () => {
    it('should call the redisClient.set method with the GETOBJECTS request', () => {
      depthai.getObjectList()
      expect(status).to.deep.equal({ key: 'DEPTHAI-REQ', value: 'GETOBJECTS' })
    })
    it('should log an error if it fails', async () => {
      await depthaiReject.getObjectList()
      expect(store.ERRORS.errorName).to.equal('REDIS_CLIENT_SET_DATA_ERROR')
      expect(store.ERRORS.moduleName).to.equal('depthai:getObjectList')
    })
  })

})
