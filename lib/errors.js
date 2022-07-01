class Error {
  constructor (errorName, moduleName, errorMessage) {
    this.timeStamp = new Date()
    this.errorName = errorName
    this.moduleName = moduleName
    this.message = errorMessage
  }
}

module.exports = {
  REDIS_CLIENT_GENERAL_ERROR: (moduleName, errorMessage) => new Error('REDIS_CLIENT_GENERAL_ERROR', moduleName, errorMessage),
  REDIS_CLIENT_READ_ERROR: (moduleName, errorMessage) => new Error('REDIS_CLIENT_READ_ERROR', moduleName, errorMessage),
  REDIS_CLIENT_CONNECT_ERROR: (moduleName, errorMessage) => new Error('REDIS_CLIENT_CONNECT_ERROR', moduleName, errorMessage),
  REDIS_CLIENT_SET_DATA_ERROR: (moduleName, errorMessage) => new Error('REDIS_CLIENT_SET_DATA_ERROR', moduleName, errorMessage),
  REDIS_CLIENT_GETDEL_DATA_ERROR: (moduleName, errorMessage) => new Error('REDIS_CLIENT_GETDEL_DATA_ERROR', moduleName, errorMessage),
  SHUTDOWN_ERROR: (moduleName, errorMessage) => new Error('SHUTDOWN_ERROR', moduleName, errorMessage),
  INVALID_FEATURE: (moduleName, errorMessage) => new Error('INSTANTIATION ERROR', moduleName, errorMessage)
}
