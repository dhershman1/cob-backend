import fp from 'fastify-plugin'

async function routes (server, options) {
  server.get('/api/logout', async (req, reply) => {
    if (req.session.authenticated) {
      req.session.destory(err => {
        if (err) {
          reply.statusCode = 500
          return 'Internal Server Error'
        }

        return reply.redirect('/')
      })
    }

    return reply.redirect('/')
  })

  server.post('/api/login', async (req, reply) => {
    const details = await server.knex('users')
      .select('id', 'username', 'password')
      .where('username', req.body.username)
      .first()

    if (!details) {
      reply.statusCode = 404
      return {
        OK: false,
        details: 'Invalid Username or Password'
      }
    }

    const match = await server.bcrypt.compare(req.body.password, details.password)

    if (match) {
      req.session.authenticated = true
      req.session.user = details.id
      return {
        OK: true
      }
    }

    reply.statusCode = 400
    return {
      OK: false,
      details: 'Invalid Username or Password'
    }
  })
}

export default fp(routes, { name: 'auth-routes' })
