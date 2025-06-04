/**
 * @jest-environment jsdom
 */
const { formatDate, changeTheme } = require("../JS/utils");

describe("formatDate()", () => {
  test("mengubah 2025-06-04 ke 04 Jun 2025", () => {
    expect(formatDate("2025-06-04")).toBe("04 Jun 2025");
  });

  test("mengubah 2025-12-25 ke 25 Des 2025", () => {
    expect(formatDate("2025-12-25")).toBe("25 Des 2025");
  });
});

describe("changeTheme()", () => {
  beforeEach(() => {
    document.body.className = "standard";
    localStorage.clear();
  });

  test("mengubah tema ke dark dan menyimpan ke localStorage", () => {
    changeTheme("dark");
    expect(document.body.className).toBe("dark");
    expect(localStorage.getItem("savedTheme")).toBe("dark");
  });

  test("mengubah tema ke standard dan menyimpan ke localStorage", () => {
    changeTheme("standard");
    expect(document.body.className).toBe("standard");
    expect(localStorage.getItem("savedTheme")).toBe("standard");
  });
});
