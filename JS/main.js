// =====================================================
// BACKEND API URL
// =====================================================
const API_URL = "http://localhost:4000";

// =====================================================
// SELECTORS
// =====================================================
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');

const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

const categorySelect = document.getElementById('task-category');
const filtersEl = document.getElementById('filters');

let savedTheme = localStorage.getItem('savedTheme') || 'standard';
let todos = [];
let currentFilter = 'all';

// =====================================================
// INIT
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    changeTheme(savedTheme);
    fetchTodos();
});

// Ask browser notification permission for reminders
if ("Notification" in window) {
    Notification.requestPermission().catch(()=>{});
}

// =====================================================
// BACKEND FUNCTIONS
// =====================================================

// ✅ Fetch all todos from backend
async function fetchTodos() {
    const res = await fetch(`${API_URL}/todos`);
    todos = await res.json();
    renderTodos();

    // schedule reminders again
    todos.forEach(scheduleReminder);
}

// ✅ Add todo to backend
async function addTodoBackend(text, category) {
    const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            text,
            category
        })
    });
    return await res.json();
}

// ✅ Delete todo from backend
async function deleteTodoBackend(id) {
    await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE"
    });
}

// ✅ Toggle complete
async function toggleCompleteBackend(id) {
    await fetch(`${API_URL}/todos/${id}/complete`, {
        method: "PUT"
    });
}

// ✅ Edit todo
async function editTodoBackend(id, newText) {
    await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: newText })
    });
}

// =====================================================
// ADD TODO
// =====================================================
async function addToDo(e) {
    e.preventDefault();

    const text = toDoInput.value.trim();
    const category = categorySelect.value;

    if (!text) {
        alert("You must write something!");
        return;
    }

    const newTodo = await addTodoBackend(text, category);
    todos.push(newTodo);

    toDoInput.value = "";
    renderTodos();
}

// =====================================================
// CLICK HANDLERS
// =====================================================
toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", onListClick);

standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

filtersEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    highlightActiveFilter();
    renderTodos();
});

// =====================================================
// HANDLE DELETE / COMPLETE / EDIT / REMINDER
// =====================================================
async function onListClick(e) {
    const target = e.target;
    const wrapper = target.closest('.todo');
    if (!wrapper) return;

    const id = wrapper.dataset.id;
    const todo = todos.find(t => String(t.id) === id);

    // ✅ DELETE
    if (target.closest('.delete-btn')) {
        wrapper.classList.add("fall");
        wrapper.addEventListener("transitionend", async () => {
            await deleteTodoBackend(id);
            todos = todos.filter(t => t.id !== Number(id));
            renderTodos();
        }, { once: true });
        return;
    }

    // ✅ COMPLETE
    if (target.closest('.check-btn')) {
        await toggleCompleteBackend(id);
        todo.completed = !todo.completed;
        renderTodos();
        return;
    }

    // ✅ EDIT
    if (target.closest('.edit-btn')) {
        const updated = prompt("Edit your task:", todo.text);
        if (updated && updated.trim().length > 0) {
            await editTodoBackend(id, updated.trim());
            todo.text = updated.trim();
            renderTodos();
        }
        return;
    }

    // ✅ REMINDER
    if (target.closest('.remind-btn')) {
        const mins = parseInt(prompt("Remind in how many minutes?"), 10);
        if (!isNaN(mins) && mins > 0) {
            todo.reminderAt = new Date(Date.now() + mins * 60000).toISOString();
            scheduleReminder(todo);
            alert("Reminder set!");
        }
        return;
    }
}

// =====================================================
// REMINDER SCHEDULER
// =====================================================
function scheduleReminder(todo) {
    if (!todo.reminderAt) return;
    const ms = new Date(todo.reminderAt) - Date.now();
    if (ms <= 0) return;

    setTimeout(() => {
        if (Notification.permission === "granted") {
            new Notification("Task Reminder", { body: todo.text });
        } else {
            alert("Reminder: " + todo.text);
        }

        todo.reminderAt = null;
    }, ms);
}

// =====================================================
// FILTER
// =====================================================
function applyFilter(arr) {
    if (currentFilter === "completed") return arr.filter(t => t.completed);
    if (currentFilter === "pending") return arr.filter(t => !t.completed);
    return arr;
}

function highlightActiveFilter() {
    [...filtersEl.children].forEach(btn => {
        btn.classList.toggle("active-filter", btn.dataset.filter === currentFilter);
    });
}

// =====================================================
// RENDER
// =====================================================
function renderTodos() {
    toDoList.innerHTML = "";

    const filtered = applyFilter(todos);

    filtered.forEach(todo => {
        const div = document.createElement("div");
        div.className = `todo ${savedTheme}-todo ${todo.completed ? "completed" : ""}`;
        div.dataset.id = todo.id;

        div.innerHTML = `
            <li class="todo-item">${todo.text}</li>

            <span class="category-tag category-${todo.category}">
                ${capitalize(todo.category)}
            </span>

            <button class="check-btn ${savedTheme}-button">
                <i class="fas fa-check"></i>
            </button>

            <button class="edit-btn ${savedTheme}-button">
                <i class="fas fa-edit"></i>
            </button>

            <button class="remind-btn ${savedTheme}-button">
                <i class="fas fa-bell"></i>
            </button>

            <button class="delete-btn ${savedTheme}-button">
                <i class="fas fa-trash"></i>
            </button>
        `;

        toDoList.appendChild(div);
    });

    applyThemeClassesToDom();
}

// =====================================================
// THEME
// =====================================================
function changeTheme(color) {
    savedTheme = color;
    localStorage.setItem("savedTheme", color);
    document.body.className = color;

    const input = document.querySelector(".todo-input");
    if (input) input.className = `todo-input ${color}-input`;

    applyThemeClassesToDom();
}

function applyThemeClassesToDom() {
    document.querySelectorAll(".todo").forEach(t => {
        const completed = t.classList.contains("completed");
        t.className = `todo ${savedTheme}-todo ${completed ? "completed" : ""}`;
    });

    document.querySelectorAll("button").forEach(btn => {
        if (btn.classList.contains("check-btn")) btn.className = `check-btn ${savedTheme}-button`;
        if (btn.classList.contains("edit-btn")) btn.className = `edit-btn ${savedTheme}-button`;
        if (btn.classList.contains("remind-btn")) btn.className = `remind-btn ${savedTheme}-button`;
        if (btn.classList.contains("delete-btn")) btn.className = `delete-btn ${savedTheme}-button`;
        if (btn.classList.contains("todo-btn")) btn.className = `todo-btn ${savedTheme}-button`;
    });
}

// =====================================================
// UTIL
// =====================================================
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}