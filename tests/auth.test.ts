import bcrypt from 'bcrypt';

// Test demonstrates the bug: login accepts any password
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
