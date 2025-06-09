// JS/utils.js
// Ini adalah file yang dimuat di HTML Anda (index.html dan profile.html).
// Menyediakan fungsi utilitas global (termasuk format tanggal dan tema).

// Fungsi untuk format tanggal (TIDAK ADA PERUBAHAN)
function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    // Menggunakan toLocaleDateString untuk format Indonesia
    return date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
}

// Fungsi untuk mengubah tema
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);

    // Ubah class body untuk tema (ini sudah benar)
    document.body.className = ''; // Hapus semua kelas body yang ada
    document.body.classList.add(color); // Tambahkan kelas tema baru ke body

    // Ubah class title
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.classList.remove('darker-title'); // Hapus yang lama
        if (color === 'darker') {
            titleElement.classList.add('darker-title');
        }
    }

    // Ubah class input (hanya relevan untuk index.html, tapi tidak masalah jika dipanggil di profile.html)
    document.querySelectorAll('.todo-input, .todo-date').forEach(input => {
        input.classList.remove('standard-input', 'light-input', 'darker-input');
        input.classList.add(`${color}-input`);
    });

    // Ubah class setiap item todo (hanya relevan untuk index.html)
    document.querySelectorAll('.todo').forEach(todo => {
        todo.classList.remove('standard-todo', 'light-todo', 'darker-todo');
        todo.classList.add(`${color}-todo`);
        if (todo.classList.contains('completed')) {
            todo.classList.add('completed');
        }
    });

    // Ubah class setiap tombol
    document.querySelectorAll('button').forEach(button => {
        button.classList.remove('standard-button', 'light-button', 'darker-button'); // Hapus class tema lama
        button.classList.add(`${color}-button`); // Tambahkan class tema baru
        // Catatan: Warna spesifik tombol diatur di main.css berdasarkan kombinasi kelas
    });

    // --- KUNCI PERBAIKAN UNTUK HALAMAN PROFIL ---
    // Terapkan kelas tema ke .profile-container
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        profileContainer.classList.remove('standard-profile-container', 'light-profile-container', 'darker-profile-container');
        profileContainer.classList.add(`${color}-profile-container`);
    }

    // Terapkan kelas tema ke .profile-picture
    const profilePicture = document.querySelector('.profile-picture');
    if (profilePicture) {
        profilePicture.classList.remove('standard-profile-picture', 'light-profile-picture', 'darker-profile-picture');
        profilePicture.classList.add(`${color}-profile-picture`);
    }
}

// Membuat fungsi-fungsi ini tersedia secara global di objek `window` untuk Browser.
window.formatDate = formatDate;
window.changeTheme = changeTheme;

// Ini untuk kebutuhan unit testing, tidak memengaruhi browser langsung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        changeTheme,
    };
}