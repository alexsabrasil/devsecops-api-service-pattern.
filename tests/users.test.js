const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('GET /api/users deve retornar HTTP 200 e uma lista', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/users`
    );

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(data));
  } finally {
    server.close();
  }
});

test('POST /api/users deve cadastrar um usuário', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Teste Automatizado',
          email: 'teste@example.com'
        })
      }
    );

    const data = await response.json();

    assert.equal(response.status, 201);
    assert.equal(data.name, 'Teste Automatizado');
    assert.equal(data.email, 'teste@example.com');
    assert.ok(data.id);
  } finally {
    server.close();
  }
});

test('POST /api/users deve rejeitar cadastro sem email', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Usuario Sem Email'
        })
      }
    );

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});

test('POST /api/users deve rejeitar cadastro sem nome', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(
      `http://127.0.0.1:${port}/api/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'semnome@example.com'
        })
      }
    );

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});
