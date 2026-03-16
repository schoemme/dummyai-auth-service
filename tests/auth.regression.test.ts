import bcrypt from 'bcrypt';
import request from 'supertest';

// Regression test for auth bypass bug (missing await on bcrypt.compare)
describe('POST /auth/login', () => {
  it('rejects wrong password', async () => {
    // Register a user
    const app = (await import('../src/index')).default;
    await request(app).post('/auth/register').send({ email: 'test@dummyai.com', password: 'correct' });

    // Wrong password must be rejected
    const res = await request(app).post('/auth/login').send({ email: 'test@dummyai.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it('accepts correct password', async () => {
    const app = (await import('../src/index')).default;
    await request(app).post('/auth/register').send({ email: 'user2@dummyai.com', password: 'mypassword' });

    const res = await request(app).post('/auth/login').send({ email: 'user2@dummyai.com', password: 'mypassword' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
