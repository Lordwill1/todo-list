// Selectors
const toDoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Theme on Load
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Add Todo
function addToDo(event) {
    event.preventDefault();

    const taskText = toDoInput.value.trim();
    const taskDate = todoDate.value;

    if (taskText === '' || taskDate === '') {
        alert("Isi task dan tanggalnya!");
        return;
    }

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('todo-row');

    const newToDo = document.createElement('li');
    newToDo.innerText = taskText;
    newToDo.classList.add('todo-item');
    rowDiv.appendChild(newToDo);

    const deadline = document.createElement('span');
    deadline.classList.add('todo-deadline');
    deadline.innerText = formatDate(taskDate);
    rowDiv.appendChild(deadline);

    savelocal({ text: taskText, date: taskDate });

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    rowDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    rowDiv.appendChild(deleted);

    toDoDiv.appendChild(rowDiv);
    toDoList.appendChild(toDoDiv);

    toDoInput.value = '';
    todoDate.value = '';
}

// Delete or Check
function deletecheck(event) {
    const item = event.target;
    // Pastikan mencari ke parent .todo
    const todo = item.closest('.todo');
    if (!todo) return; // Jika ga ketemu

    if (item.classList.contains('delete-btn')) {
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', () => {
            todo.remove();
        });
    }

    if (item.classList.contains('check-btn')) {
        todo.classList.toggle("completed");
    }
}

// Save to Local Storage (object-based)
function savelocal(todoObj) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todoObj);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load Todos
function getTodos() {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

    todos.forEach(({ text, date }) => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('todo-row');

        const newToDo = document.createElement('li');
        newToDo.innerText = taskText;
        newToDo.classList.add('todo-item');
        rowDiv.appendChild(newToDo);

        const deadline = document.createElement('div');
        deadline.classList.add('todo-deadline');
        deadline.innerText = formatDate(taskDate);
        rowDiv.appendChild(deadline);

        savelocal({ text: taskText, date: taskDate });

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        rowDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        rowDiv.appendChild(deleted);

        toDoDiv.appendChild(rowDiv);
        toDoList.appendChild(toDoDiv);
    });
}

// Remove from Local Storage
function removeLocalTodos(todoElement) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const content = todoElement.children[0].innerText;
    const regex = /\(Deadline: .*?\)$/;
    const pureText = content.replace(regex, '').trim();

    todos = todos.filter(t => t.text !== pureText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Date Format
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
}

// Theme Handling
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

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
