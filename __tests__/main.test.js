/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

// --- JSDOM PATCH: Hindari error location.href
if (!window.location.assign) {
  window.location.assign = jest.fn();
}
window.location.href = "";

// --- Mock global alert agar bisa dicek
global.alert = jest.fn();

// --- Inject firebase mock ke global scope
global.firebase = require("../__mocks__/firebase");

// --- Load HTML
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
document.documentElement.innerHTML = html;

// --- Load utils dan main (urutan penting)
require("../JS/utils.js");
require("../JS/main.js");

const firebase = global.firebase;

describe("Todo App", () => {
  beforeEach(() => {
    document.querySelector(".todo-input").value = "";
    document.querySelector(".todo-date").value = "";
    firebase.auth().currentUser = { uid: "mock-user" };
    global.alert.mockClear();
  });

  test("tidak boleh menambahkan todo jika input kosong", () => {
    const btn = document.querySelector(".todo-btn");
    btn.click();
    expect(global.alert).toHaveBeenCalledWith("Isi task dan tanggalnya!");
  });

  test("berhasil menambahkan todo jika input valid dan user login", async () => {
    document.querySelector(".todo-input").value = "Belajar Unit Test";
    document.querySelector(".todo-date").value = "2025-06-05";

    await window.addToDo({ preventDefault: () => {} });

    expect(firebase.firestore().collection).toHaveBeenCalledWith("todos");
    expect(firebase.firestore().add).toHaveBeenCalledWith({
      uid: "mock-user",
      text: "Belajar Unit Test",
      date: "2025-06-05",
      completed: false, // ✅ Tambahan baru agar sesuai real logic
      createdAt: "MOCKED_TIMESTAMP",
    });
  });
});
