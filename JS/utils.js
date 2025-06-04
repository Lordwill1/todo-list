// JS/utils.js
// Ini adalah file yang dimuat di HTML Anda (index.html).
// Menyediakan fungsi utilitas global (termasuk format tanggal dan tema).

// Fungsi untuk format tanggal (TIDAK ADA PERUBAHAN)
function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
}

// Fungsi untuk mengubah tema (TIDAK ADA PERUBAHAN)
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);

    document.body.className = color; // Ubah class body untuk tema

    // Ubah class title
    const titleElement = document.getElementById('title');
    if (titleElement) {
        if (color === 'darker') {
            titleElement.classList.add('darker-title');
        } else {
            titleElement.classList.remove('darker-title');
        }
    }

    // Ubah class input
    const todoInput = document.querySelector('.todo-input');
    const todoDateInput = document.querySelector('.todo-date');
    if (todoInput) todoInput.className = `todo-input ${color}-input`;
    if (todoDateInput) todoDateInput.className = `todo-date ${color}-input`;

    // Ubah class setiap item todo
    document.querySelectorAll('.todo').forEach(todo => {
        // Hapus class tema lama, lalu tambahkan yang baru
        todo.classList.remove('standard-todo', 'light-todo', 'darker-todo');
        todo.classList.add('todo', `${color}-todo`);
        // Pastikan class 'completed' tetap ada jika sudah ada
        if (todo.classList.contains('completed')) {
            todo.classList.add('completed');
        }
    });

    // Ubah class setiap tombol
    document.querySelectorAll('button').forEach(button => {
        // Hapus class tema lama, lalu tambahkan yang baru
        button.classList.remove('standard-button', 'light-button', 'darker-button');
        if (button.classList.contains('check-btn')) {
            button.classList.add('check-btn', `${color}-button`);
        } else if (button.classList.contains('delete-btn')) {
            button.classList.add('delete-btn', `${color}-button`);
        } else if (button.classList.contains('todo-btn')) {
            button.classList.add('todo-btn', `${color}-button`);
        } else if (button.classList.contains('logout-btn')) {
            button.classList.add('logout-btn', `${color}-button`);
        }
    });
}

// Membuat fungsi-fungsi ini tersedia secara global di objek `window` untuk Browser.
window.formatDate = formatDate;
window.changeTheme = changeTheme;

module.exports = {
  formatDate,
  changeTheme,
};
