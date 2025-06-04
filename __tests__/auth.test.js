/**
 * @jest-environment jsdom
 */

// Mock Firebase
const mockCreateUserWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-register' } }));
const mockSignInWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-login' } }));

const mockAuth = {
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
};

global.firebase = {
  auth: jest.fn(() => mockAuth),
};

// Import setelah global.firebase disiapkan
const { registerUser, loginUser } = require("../JS/auth.js");

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('berhasil memanggil createUserWithEmailAndPassword dengan email dan password benar', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      await registerUser(email, password);

      expect(firebase.auth).toHaveBeenCalledTimes(1);
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('gagal saat createUserWithEmailAndPassword error', async () => {
      const error = new Error('auth/email-already-in-use');
      mockCreateUserWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(error));

      await expect(registerUser('a@a.com', '123456')).rejects.toThrow(error);
    });
  });

  describe('loginUser', () => {
    it('berhasil memanggil signInWithEmailAndPassword dengan kredensial benar', async () => {
      const email = 'existing@example.com';
      const password = 'securepassword';

      await loginUser(email, password);

      expect(firebase.auth).toHaveBeenCalledTimes(1);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('gagal saat signInWithEmailAndPassword error', async () => {
      const error = new Error('auth/user-not-found');
      mockSignInWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(error));

      await expect(loginUser('wrong@example.com', 'wrongpw')).rejects.toThrow(error);
    });
  });
});
