require('dotenv').config()
const Registry = require('../lib/registry')
global.registry = new Registry()
