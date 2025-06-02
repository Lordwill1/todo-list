/**
 * @jest-environment jsdom
 */

const { formatDate, changeTheme } = require('../JS/utils.js');
require('@testing-library/jest-dom');

describe('formatDate', () => {
  it('should format ISO date to Indonesian format', () => {
    const iso = '2024-05-01';
    const result = formatDate(iso);
    expect(result).toBe('01 Mei 2024');
  });

  it('should return empty string on null/undefined input', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('changeTheme', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="title" class="title"></div>
      <input class="todo-input" />
      <input class="todo-date" />
      <button class="todo-btn"></button>
      <button class="check-btn"></button>
      <button class="delete-btn"></button>
      <div class="todo completed"></div>
      <div class="todo"></div>
    `;
  });

  it('should set localStorage and update body class', () => {
    changeTheme('darker');
    expect(localStorage.getItem('savedTheme')).toBe('darker');
    expect(document.body.className).toBe('darker');
    expect(document.getElementById('title').classList.contains('darker-title')).toBe(true);
  });

  it('should update button and input classes correctly', () => {
    changeTheme('light');
    expect(document.querySelector('.todo-input').className).toContain('light-input');
    expect(document.querySelector('.check-btn').className).toContain('light-button');
    expect(document.querySelector('.delete-btn').className).toContain('light-button');
    expect(document.querySelector('.todo-btn').className).toContain('light-button');
  });

  it('should handle completed todo class correctly', () => {
    changeTheme('standard');
    const todos = document.querySelectorAll('.todo');
    expect(todos[0].className).toBe('todo standard-todo completed');
    expect(todos[1].className).toBe('todo standard-todo');
  });
});
