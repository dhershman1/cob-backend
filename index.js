import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bcrypt from 'fastify-bcrypt'
import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import serve from '@fastify/static'
import session from '@fastify/session'
import 'dotenv/config'

import auth from './routes/auth.js'
import knex from './plugins/database.js'
import users from './routes/user.js'

const fastify = Fastify({
  logger: true
})
const __dirname = path.dirname(fileURLToPath(import.meta.url))

fastify.register(cookie)
fastify.register(session, {
  secret: process.env.APP_SECRET
})

fastify.register(knex, {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PASS
  }
})

fastify.register(bcrypt, {
  saltWorkFactor: 12
})

fastify.register(serve, {
  root: path.join(__dirname, 'public', 'dist'),
  prefix: '/public/'
})

fastify.register(auth)
fastify.register(users)

fastify.get('/test', async (req, reply) => {
  console.log(req.session.authenticated)
  return { OK: true }
})
fastify.get('/', async (req, reply) => {
  console.log(req.session.authenticated)
  return reply.sendFile('index.html')
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
