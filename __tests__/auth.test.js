const { register, login } = require('../JS/auth');

global.firebase = {
  auth: () => ({
    createUserWithEmailAndPassword: jest.fn((email, pass) => Promise.resolve({ user: { email } })),
    signInWithEmailAndPassword: jest.fn((email, pass) => Promise.resolve({ user: { email } })),
  })
};

describe('Auth', () => {
  it('should register a user', async () => {
    const res = await register('user@test.com', 'password');
    expect(res.user.email).toBe('user@test.com');
  });

  it('should login a user', async () => {
    const res = await login('user@test.com', 'password');
    expect(res.user.email).toBe('user@test.com');
  });
});
