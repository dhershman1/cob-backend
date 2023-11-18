import fp from 'fastify-plugin'

async function tagRoutes (server, options) {
  server.post('/api/tag/create', async (req, reply) => {
    try {
      await server.knex('tags')
        .insert({
          title: req.body.title
        })
    } catch (e) {
      if (e.detail.includes('already exists')) {
        reply.statusCode = 409
      } else {
        reply.statusCode = 400
      }

      return {
        OK: false,
        details: e.detail
      }
    }

    return { OK: true }
  })
}

export default fp(tagRoutes, { name: 'tag-routes' })
