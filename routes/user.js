import fp from 'fastify-plugin'

async function userRoutes (server, options) {
  server.post('/api/user/create', async (req, reply) => {
    try {
      const hash = await server.bcrypt.hash(req.body.password)

      await server.knex('users')
        .insert({
          username: req.body.username,
          password: hash
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

export default fp(userRoutes, { name: 'user-routes' })
