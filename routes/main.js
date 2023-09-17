async function routes (fastify, options) {
  fastify.get('/', async (_, reply) => {
    return { hello: 'world' }
  })
}

export default routes
