const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const feathers = require('feathers')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const socketio = require('feathers-socketio')

const notFound = require('feathers-errors/not-found')
const handler = require('feathers-errors/handler')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')

const app = feathers()
  // Load app configuration
  .configure(configuration())
  // Enable CORS, security, compression, favicon and body parsing
  .use(cors())
  .use(helmet())
  .use(compress())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

  // Set up Plugins and providers
  .configure(hooks())
  .configure(rest())
  .configure(socketio())

  // Configure other middleware (see `middleware/index.js`)
  .configure(middleware)
  // Set up our services (see `services/index.js`)
  .configure(services)
  // Configure a middleware for 404s and the error handler
  .use(notFound())
  .use(handler())

  .hooks(appHooks)

module.exports = app
