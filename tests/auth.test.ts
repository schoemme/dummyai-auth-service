import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/index';

describe('Auth Login Bug', () => {
  it('should reject wrong password but currently does not', async () => {
    const hash = await bcrypt.hash('correct-password', 10);

    // This is the bug: without await, compare returns a Promise (truthy)
    const resultWithoutAwait = bcrypt.compare('wrong-password', hash);
    expect(!!resultWithoutAwait).toBe(true); // Bug: always truthy

    // This is the fix: with await, compare returns the actual boolean
    const resultWithAwait = await bcrypt.compare('wrong-password', hash);
    expect(resultWithAwait).toBe(false); // Correct behavior
  });
});

describe('Auth Login Regression', () => {
  const testEmail = 'regression@test.com';
  const testPassword = 'correct-password-123';

  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
  });

  it('should return 200 and a token for the correct password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should return 401 for an incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
