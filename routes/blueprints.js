import fp from 'fastify-plugin'
import Ajv from 'ajv'

const ajv = new Ajv()
const schemas = {
  createBlueprint: {
    type: 'object',
    required: [
      'title',
      'bp_string'
    ],
    additionalProperties: false,
    properties: {
      title: { type: 'string' },
      summary: { type: 'string' },
      thumbnail: { type: 'string' },
      description: { type: 'string' },
      version: { type: 'string' },
      bp_string: { type: 'string' }
    }
  }
}

async function blueprints (server, options) {
  server.post('/blueprint/create', async (req, reply) => {
    if (!req.session.authenticated) {
      reply.statusCode = 401
      return 'Invalid or Empty Session'
    }
    const validate = ajv.compile(schemas.createBlueprint)

    const valid = validate(req.body)

    if (!valid) {
      reply.statusCode = 400

      return 'Bad Request'
    }

    await server.knex('blueprints')
      .insert({
        ...req.body,
        user_id: req.session.user
      })

    return { OK: true }
  })

  server.get('/blueprint/:id', async (req, reply) => {
    if (!req.session.authenticated) {
      reply.statusCode = 401

      return 'Invalid or Empty Session'
    }

    if (!req.params.id) {
      reply.statusCode = 400

      return 'Bad Request'
    }

    const blueprint = server.knex('blueprints')
      .select('title', 'bp_string', 'thumbnail', 'summary', 'description', 'version')
      .where('id', req.params.id)
      .first()

    return blueprint
  })
}

export default fp(blueprints, { name: 'blueprint-routes' })
