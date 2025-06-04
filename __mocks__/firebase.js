const FieldValue = {
  serverTimestamp: jest.fn(() => "MOCKED_TIMESTAMP") // Mock serverTimestamp
};

const mockFirestore = {
  collection: jest.fn(() => mockFirestore),
  doc: jest.fn(() => mockFirestore),
  add: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  where: jest.fn(() => mockFirestore),
  orderBy: jest.fn(() => mockFirestore),
  onSnapshot: jest.fn((cb) => cb({
    empty: true,
    docs: [],
    forEach: jest.fn(),
  })),
  // FieldValue tidak perlu ada di sini jika Anda mengaksesnya via firebase.firestore.FieldValue
  // Namun, jika Anda juga menggunakan db.FieldValue, maka ini tetap diperlukan.
  // Untuk konsistensi dengan SDK asli, kita akan memasukkannya di bawah sebagai bagian dari firestore namespace.
};

const mockAuth = {
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-login' } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid-register' } })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((cb) => {
    cb({ uid: 'mock-user' });
    return jest.fn(); // unsubscribe
  }),
  currentUser: { uid: 'mock-user' },
};


module.exports = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => mockAuth),
  // FIX: Menggabungkan fungsi dan properti namespace ke dalam satu objek.
  // Ini memungkinkan firebase.firestore() DAN firebase.firestore.FieldValue.
  firestore: Object.assign(jest.fn(() => mockFirestore), { FieldValue }),
};