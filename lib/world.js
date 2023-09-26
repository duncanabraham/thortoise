/*
A World is a grid of points, each point represents a 200x200x200mm cube of space in the real world.
A Point maintains a list of items that have been discovered at that point
An Items list is a managed list that allows Item types to be added to the list associated with a point
*/
const { v4: uuid } = require('uuid')
const schemaWorld = require('../schemas/World_schema.js')
const schemaPoint = require('../schemas/Point_schema.js')

class Point {
  constructor (options) {
    Object.assign(this, options)
    this._type = null
    this.items = new Items()
  }

  get key () {
    return `${this.x}-${this.y}-${this.z}`
  }

  isZ (z) {
    return this.z === z
  }

  get type () {
    return this._type
  }

  set type (type) {
    this._type = type
  }

  export () {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      type: this._type,
      items: this.items.export()
    }
  }

  static import (data) {
    const point = new Point({ x: data.x, y: data.y, z: data.z })
    point.type = data.type
    point.items = Items.import(data.items)
    return point
  }

  _validate (options) {
    const { error } = schemaPoint.validate(options)
    if (error) {
      throw new Error(`Invalid options: ${error.details[0].message}`)
    }
  }
}

class Item {
  constructor (options) {
    Object.assign(this, options)
    this.timestamp = Date.now()
    this.id = uuid()
  }
}

class Items {
  constructor () {
    this.items = {}
  }

  get length () {
    return Object.keys(this.items).length
  }

  addItem (item) {
    if (item instanceof Item) {
      this.items[item.id] = item
    } else {
      throw new Error('You can only store Items in an Items list, duh!')
    }
  }

  delItem (id) {
    delete this.items[id]
  }

  clear () {
    this.items = {}
  }

  export () {
    return Object.values(this.items).map(item => item.export())
  }

  static import (data) {
    const items = new Items()
    data.forEach(itemData => {
      items.addItem(Item.import(itemData))
    })
    return items
  }
}

class World {
  constructor (options) {
    this._validate(options)
    Object.assign(this, options)
    this.map = new Map() // a list of Points
    this.registry = new ItemRegistry()
    this._init()
  }

  _init () {
    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.length; y++) {
          const point = new Point({ x, y, z })
          let type = 'air'
          if (z === 0) { type = 'grass' }
          if (x === 0 || y === 0 || x === this.width - 1 || y === this.length - 1) { type = 'wall' }
          point.type = type
          this.map.set(point.key, point)
        }
      }
    }
  }

  pointFromKey (key) {
    return this.map.get(key)
  }

  addContent (point, item) {
    const { items } = this.pointFromKey(point.key)
    const register = new RegistryItem(item, point)
    this.registry.updateItem(register)
    items.addItem(item)
  }

  changeType (point, type) {
    const content = this.pointFromKey(point.key)
    content.type = type
  }

  saveWorld () {
    const world = Array.from(this.map.entries())
    const serializedWorld = JSON.stringify(world)
    const serializedRegistry = this.registry.export()
    return JSON.stringify({ world: serializedWorld, registry: serializedRegistry })
  }

  loadWorld (worldData) {
    const data = JSON.parse(worldData)
    this.map = new Map(JSON.parse(data.world).map(([key, pointData]) => [key, Point.import(pointData)]))
    this.registry.import(data.registry)
  }

  layerMap (zLayer = 0) {
    const pointList = Array.from(this.map.values()).filter(point => point.isZ(zLayer))
    const result = []
    for (let x = 0; x < this.width; x++) {
      result[x] = []
      for (let y = 0; y < this.length; y++) {
        const point = pointList.find(p => p.x === x && p.y === y)
        result[x].push(point)
      }
    }
    return result
  }

  asBinaryMap (zLayer) {
    const mapLayer = this.layerMap(zLayer)
    for (let x = 0; x < this.width; x++) {
      const row = mapLayer[x].map(p => {
        return p.items.length || p.type === 'wall' ? 1 : 0
      })
      mapLayer[x] = row
    }
    return mapLayer
  }

  _validate (options) {
    const { error } = schemaWorld.validate(options)
    if (error) {
      throw new Error(`Invalid options: ${error.details[0].message}`)
    }
  }
}

class RegistryItem {
  constructor (item, point) {
    this.item = item
    this.id = item.id
    this.log = {}
    this.lastPosition = { point, time: item.timestamp }
    this.log[item.timestamp] = { item, point }
  }

  addLog (item, point) {
    this.lastPosition = { point, time: Date.now() }
    this.log[this.lastPosition.time] = { item, point }
  }
}

class ItemRegistry {
  constructor () {
    this.registry = {} // Item ID to item history
  }

  // create or update an item in the registry
  updateItem (item, point) {
    if (this.registry[item.id]) {
      this.registry[item.id].addLog(item, point)
    } else {
      this.registry[item.id] = new RegistryItem(item, point)
    }
  }

  // Retrieves the history of an item
  getHistory (item) {
    return this.registry[item.id].log
  }

  // Retrieves the current location and timestamp of an item
  getCurrentLocation (item) {
    return this.registry[item.id].lastPosition
  }

  export () {
    // Convert the registry to a simple object format that can be serialized as JSON
    const exportData = {}
    for (const [key, registryItem] of Object.entries(this.registry)) {
      exportData[key] = {
        log: registryItem.log,
        lastPosition: registryItem.lastPosition
      }
    }
    return JSON.stringify(exportData)
  }

  import (regitryData) {
    // Load the JSON data into the registry
    const importData = JSON.parse(regitryData)
    for (const [key, registryData] of Object.entries(importData)) {
      const item = registryData.log[registryData.lastPosition.time].item
      const point = registryData.lastPosition.point
      const registryItem = new RegistryItem(item, point)
      registryItem.log = registryData.log
      registryItem.lastPosition = registryData.lastPosition
      this.registry[key] = registryItem
    }
  }
}

module.exports = {
  World,
  Point,
  item: (options) => new Item(options)
}
