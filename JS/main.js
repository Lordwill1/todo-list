// =========================
// SELECTORS
// =========================
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');

const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

const categorySelect = document.getElementById('task-category'); // category dropdown
const searchBar = document.getElementById('search-bar');         // search bar
const filtersEl = document.getElementById('filters');            // filter buttons wrapper

// =========================
// STATE
// =========================
let savedTheme = localStorage.getItem('savedTheme') || 'standard';

let todos = loadTodos();

let currentFilter = 'all';


// =========================
// INITIALIZATION
// =========================

document.addEventListener("DOMContentLoaded", () => {
    changeTheme(savedTheme);
    renderTodos();
    highlightActiveFilter();
});


// =========================
// EVENT LISTENERS
// =========================
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', onListClick);

standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

if (filtersEl) {
    filtersEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;

        currentFilter = btn.dataset.filter;
        renderTodos();
        highlightActiveFilter();
    });
}

if (searchBar) {
    searchBar.addEventListener('input', () => {
        const term = searchBar.value.toLowerCase();
        const filtered = todos.filter(t => t.text.toLowerCase().includes(term));
        renderFiltered(filtered);
    });
}



// =========================
// STORAGE HELPERS
// =========================
function loadTodos() {
    const raw = localStorage.getItem('todos');
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return parsed.map(t => ({
            id: t.id ?? Date.now() + Math.random(),
            text: t.text ?? '',
            completed: !!t.completed,
            category: t.category || 'general'
        }));
    } catch {
        return [];
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}



// =========================
// ADD TODO
// =========================
function addToDo(e) {
    e.preventDefault();

    const text = toDoInput.value.trim();
    const category = categorySelect ? categorySelect.value : 'general';

    if (!text) {
        alert("You must write something!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        completed: false,
        category
    };

    todos.push(newTask);
    saveTodos();

    toDoInput.value = '';
    renderTodos();
}



// =========================
// LIST CLICK HANDLER
// =========================
function onListClick(e) {
    const target = e.target;

    // DELETE
    if (target.classList.contains('delete-btn')) {
        const wrapper = target.closest('.todo');
        const id = wrapper.dataset.id;

        wrapper.classList.add('fall');

        wrapper.addEventListener('transitionend', () => {
            todos = todos.filter(t => String(t.id) !== String(id));
            saveTodos();
            renderTodos();
        }, { once: true });

        return;
    }

    // COMPLETE
    if (target.classList.contains('check-btn')) {
        const wrapper = target.closest('.todo');
        const id = wrapper.dataset.id;
        const t = todos.find(x => String(x.id) === id);

        if (t) {
            t.completed = !t.completed;
            saveTodos();
            renderTodos();
        }
        return;
    }

    // EDIT ✏️
    if (target.classList.contains('edit-btn')) {
        const wrapper = target.closest('.todo');
        const id = wrapper.dataset.id;
        const t = todos.find(x => String(x.id) === id);

        if (!t) return;

        const li = wrapper.querySelector('.todo-item');

        const input = document.createElement('input');
        input.value = t.text;
        input.className = 'edit-input';

        wrapper.classList.add('editing');
        li.replaceWith(input);
        input.focus();

        const finish = () => {
            t.text = input.value.trim() || t.text;
            wrapper.classList.remove('editing');
            saveTodos();
            renderTodos();
        };

        input.addEventListener('blur', finish);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') finish();
        });
    }
}



// =========================
// RENDERING
// =========================
function renderTodos() {
    toDoList.innerHTML = '';

    const filtered = applyFilter(todos);

    filtered.forEach(todo => {
        const el = createTodoElement(todo);
        toDoList.appendChild(el);
    });

    applyThemeClassesToDom();
}

function renderFiltered(list) {
    toDoList.innerHTML = '';

    list.forEach(t => {
        toDoList.appendChild(createTodoElement(t));
    });

    applyThemeClassesToDom();
}



// CREATE ONE TODO ELEMENT
function createTodoElement(todo) {
    const wrapper = document.createElement('div');
    wrapper.className = `todo ${savedTheme}-todo${todo.completed ? ' completed' : ''}`;
    wrapper.dataset.id = todo.id;

    const li = document.createElement('li');
    li.className = 'todo-item';
    li.textContent = todo.text;

    const tag = document.createElement('span');
    tag.className = `category-tag category-${todo.category}`;
    tag.textContent = capitalize(todo.category);

    const checkBtn = document.createElement('button');
    checkBtn.className = `check-btn ${savedTheme}-button`;
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';

    const editBtn = document.createElement('button');
    editBtn.className = `edit-btn ${savedTheme}-button`;
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';

    const delBtn = document.createElement('button');
    delBtn.className = `delete-btn ${savedTheme}-button`;
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';

    wrapper.appendChild(li);
    wrapper.appendChild(tag);
    wrapper.appendChild(checkBtn);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(delBtn);

    return wrapper;
}



// =========================
// FILTERS
// =========================
function applyFilter(arr) {
    if (currentFilter === 'completed') return arr.filter(t => t.completed);
    if (currentFilter === 'pending') return arr.filter(t => !t.completed);
    return arr;
}

function highlightActiveFilter() {
    if (!filtersEl) return;

    [...filtersEl.querySelectorAll('[data-filter]')].forEach(btn => {
        btn.classList.toggle('active-filter', btn.dataset.filter === currentFilter);
    });
}



// =========================
// THEME
// =========================
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

    document.body.className = color;

    const titleEl = document.getElementById('title');
    if (titleEl) {
        if (color === 'darker') titleEl.classList.add('darker-title');
        else titleEl.classList.remove('darker-title');
    }

    const inputEl = document.querySelector('.todo-input');
    if (inputEl) inputEl.className = `todo-input ${color}-input`;

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn'))
            button.className = `check-btn ${color}-button`;
        else if (button.classList.contains('delete-btn'))
            button.className = `delete-btn ${color}-button`;
        else if (button.classList.contains('edit-btn'))
            button.className = `edit-btn ${color}-button`;
        else if (button.classList.contains('todo-btn'))
            button.className = `todo-btn ${color}-button`;
    });

    document.querySelectorAll('.todo').forEach(todo => {
        const isCompleted = todo.classList.contains('completed');
        todo.className = `todo ${color}-todo${isCompleted ? ' completed' : ''}`;
    });
}

function applyThemeClassesToDom() {
    document.querySelectorAll('.check-btn').forEach(b =>
        b.className = `check-btn ${savedTheme}-button`
    );
    document.querySelectorAll('.delete-btn').forEach(b =>
        b.className = `delete-btn ${savedTheme}-button`
    );
    document.querySelectorAll('.edit-btn').forEach(b =>
        b.className = `edit-btn ${savedTheme}-button`
    );
    document.querySelectorAll('.todo').forEach(t => {
        const isCompleted = t.classList.contains('completed');
        t.className = `todo ${savedTheme}-todo${isCompleted ? ' completed' : ''}`;
    });
}



// =========================
// UTILITIES
// =========================
function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}