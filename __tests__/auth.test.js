const mockCreateUserWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-register' } }));
const mockSignInWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-login' } }));

const mockAuth = {
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
};

global.firebase = {
  auth: jest.fn(() => mockAuth),
};

const { register, login } = require('../JS/auth.js');

describe('Authentication Functions', () => {
  beforeEach(() => {
    // clear all mocks, agar bersih
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call firebase.auth().createUserWithEmailAndPassword with correct credentials on success', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      await register(email, password);

      // expect firebase.auth() dipanggil
      expect(global.firebase.auth).toHaveBeenCalledTimes(1);
      // expect createUserWithEmailAndPassword dipanggil pakai email dan password mock
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('should reject if firebase.auth().createUserWithEmailAndPassword throws an error', async () => {
      const email = 'invalid@example.com';
      const password = 'weakpassword';
      const errorMessage = 'Firebase: The email address is already in use by another account (auth/email-already-in-use).';
      const error = new Error(errorMessage);

      // Make the mock function reject with an error
      mockCreateUserWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(error));

      await expect(register(email, password)).rejects.toThrow(error);

      expect(global.firebase.auth).toHaveBeenCalledTimes(1);
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });
  });

  describe('login', () => {
    it('should call firebase.auth().signInWithEmailAndPassword with correct credentials on success', async () => {
      const email = 'existing@example.com';
      const password = 'securepassword';

      await login(email, password);

      // Expect firebase.auth() to have been called
      expect(global.firebase.auth).toHaveBeenCalledTimes(1);
      // Expect signInWithEmailAndPassword to have been called with the provided email and password
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('should reject if firebase.auth().signInWithEmailAndPassword throws an error', async () => {
      const email = 'nonexistent@example.com';
      const password = 'wrongpassword';
      const errorMessage = 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted (auth/user-not-found).';
      const error = new Error(errorMessage);

      // Make the mock function reject with an error
      mockSignInWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(error));

      await expect(login(email, password)).rejects.toThrow(error);

      expect(global.firebase.auth).toHaveBeenCalledTimes(1);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });
  });
});