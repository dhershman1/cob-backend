import knex from 'knex'
import fp from 'fastify-plugin'

function knexPlugin (fastify, options, done) {
  if (!fastify.knex) {
    const handler = knex(options)

    fastify.decorate('knex', handler)
    fastify.addHook('onClose', (instance, done) => {
      if (instance.knex === handler) {
        instance.knex.destroy()
      }

      done()
    })
  }

  done()
}

export default fp(knexPlugin, { name: 'knex-db' })
