// server.js
const Fastify = require('fastify');
const path = require('path');
const fastifyStatic = require('fastify-static');
const db = require('./db');

const fastify = Fastify({ logger: true });

// Servir arquivos estáticos (como index.html)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

// Rota para pegar todos os usuários
fastify.get('/api/users', async (request, reply) => {
  const users = db.prepare('SELECT * FROM users').all();
  return users;
});

// Rota para adicionar usuário (JSON: { "name": "João" })
fastify.post('/api/users', async (request, reply) => {
  const { name } = request.body;
  if (!name) return reply.code(400).send({ error: 'Nome é obrigatório' });

  const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
  const result = stmt.run(name);

  return { id: result.lastInsertRowid, name };
});

// Iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3236 });
    console.log('Servidor rodando em http://localhost:3236');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
