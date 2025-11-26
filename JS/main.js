// ================== SELECTORS ==================
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


// ================== STATS + STREAK ==================

// Format today's date (YYYY-MM-DD)
function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

// ---------- TASK STATS ----------
function calculateTaskStats() {
    const items = Array.from(toDoList.querySelectorAll(".todo"));
    const total = items.length;
    let completed = items.filter(item => item.classList.contains("completed")).length;

    return { total, completed, pending: total - completed };
}

function updateTaskStatsUI() {
    const { total, completed, pending } = calculateTaskStats();
    document.getElementById("stats-total").textContent = total;
    document.getElementById("stats-completed").textContent = completed;
    document.getElementById("stats-pending").textContent = pending;
}


// ---------- STREAK SYSTEM ----------
const STREAK_COUNT_KEY = "todo_streak_count";
const STREAK_LAST_DONE_KEY = "todo_streak_last_done";

function loadStreak() {
    return {
        count: Number(localStorage.getItem(STREAK_COUNT_KEY)) || 0,
        last: localStorage.getItem(STREAK_LAST_DONE_KEY)
    };
}

function saveStreak(count, lastDate) {
    localStorage.setItem(STREAK_COUNT_KEY, count);
    localStorage.setItem(STREAK_LAST_DONE_KEY, lastDate);
}

function updateStreakUI() {
    const { count } = loadStreak();
    document.getElementById("streak-count").textContent = count;
}

function handleMarkTodayDone() {
    const today = getTodayKey();
    const { count, last } = loadStreak();

    if (last === today) {
        alert("Today's streak is already counted! 🔥");
        return;
    }

    let newCount = 1;

    if (last) {
        const diff = (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24);
        newCount = diff === 1 ? count + 1 : 1;
    }

    saveStreak(newCount, today);
    updateStreakUI();

    // Confetti 🎉
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });

    alert("Streak updated! 🎉");
}

function initStreakFeature() {
    const btn = document.getElementById("streak-done-btn");
    if (btn) btn.addEventListener("click", handleMarkTodayDone);
    updateStreakUI();
}



// ================== EVENT LISTENERS ==================
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);

document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", updateTaskStatsUI);
document.addEventListener("DOMContentLoaded", initStreakFeature);

standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));


// Apply saved theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);


// ================== TODO FUNCTIONS ==================
function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }

    createTodoElement(toDoInput.value, false);
    savelocal(toDoInput.value, false);

    updateTaskStatsUI();
    toDoInput.value = '';
}

function createTodoElement(text, completed) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    if (completed) toDoDiv.classList.add("completed");

    const newToDo = document.createElement('li');
    newToDo.innerText = text;
    newToDo.classList.add('todo-item');

    toDoDiv.appendChild(newToDo);

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
}

function deletecheck(event) {
    const item = event.target;

    // Delete
    if (item.classList.contains('delete-btn')) {
        const todoDiv = item.parentElement;
        todoDiv.classList.add("fall");

        removeLocalTodos(todoDiv);

        todoDiv.addEventListener('transitionend', () => {
            todoDiv.remove();
            updateTaskStatsUI();
        });
    }

    // Check (completed)
    if (item.classList.contains('check-btn')) {
        const todoDiv = item.parentElement;
        todoDiv.classList.toggle("completed");

        updateCompletionInLocal(todoDiv);
        updateTaskStatsUI();
    }
}



// ================== LOCAL STORAGE ==================
function savelocal(todoText, completed = false) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text: todoText, completed: completed });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    todos.forEach(todoObj => {
        if (!todoObj.text) return; // prevents undefined
        createTodoElement(todoObj.text, todoObj.completed);
    });

    updateTaskStatsUI();
}


function removeLocalTodos(todoDiv) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const text = todoDiv.children[0].innerText;

    todos = todos.filter(t => t.text !== text);

    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateCompletionInLocal(todoDiv) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const text = todoDiv.children[0].innerText;
    const isCompleted = todoDiv.classList.contains("completed");

    todos = todos.map(t => {
        if (t.text === text) {
            return { text: t.text, completed: isCompleted };
        }
        return t;
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}



// ================== THEME ==================
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

    document.body.className = color;

    document.querySelector('input').className = `${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = todo.classList.contains("completed")
            ? `todo ${color}-todo completed`
            : `todo ${color}-todo`;
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
