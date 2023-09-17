async function routes (fastify, options) {
  fastify.get('/logout', async (_, reply) => {
    return { hello: 'world' }
  })
}

export default routes
