// utils.js
function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
}

function changeTheme(color) {
  localStorage.setItem('savedTheme', color);
  const savedTheme = color;

  document.body.className = color;
  color === 'darker'
    ? document.getElementById('title').classList.add('darker-title')
    : document.getElementById('title').classList.remove('darker-title');

  document.querySelector('.todo-input').className = `todo-input ${color}-input`;
  document.querySelector('.todo-date').className = `todo-date ${color}-input`;

  document.querySelectorAll('.todo').forEach(todo => {
    todo.className = todo.classList.contains('completed') ?
      `todo ${color}-todo completed` :
      `todo ${color}-todo`;
  });

  document.querySelectorAll('button').forEach(button => {
    if (button.classList.contains('check-btn')) {
      button.className = `check-btn ${color}-button`;
    } else if (button.classList.contains('delete-btn')) {
      button.className = `delete-btn ${color}-button`;
    } else if (button.classList.contains('todo-btn')) {
      button.className = `todo-btn ${color}-button`;
    }
  });
}

module.exports = { formatDate, changeTheme };
