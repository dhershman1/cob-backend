import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Fastify from 'fastify'
import serve from '@fastify/static'

import auth from './routes/auth.js'

const fastify = Fastify({
  logger: true
})
const __dirname = path.dirname(fileURLToPath(import.meta.url))

fastify.register(serve, {
  root: path.join(__dirname, 'public', 'dist'),
  prefix: '/public/'
})
fastify.register(auth)

fastify.get('/', function (_, reply) {
  reply.sendFile('index.html')
})

fastify.listen({
  port: 3000
}, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  fastify.log.info(`Server is now listening on ${address}`)
})
