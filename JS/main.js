// Selectors
const toDoInput = document.querySelector('.todo-input');
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

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(localStorage.getItem('savedTheme'));

// Functions
function addToDo(event) {
    // Prevents form from submitting / Prevents form from reloading;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    const dueDateInput = document.querySelector('.due-date');  // Ensure the correct selector
    const dueDate = dueDateInput.value;  // Get the date from input

    if (toDoInput.value === '') {
        alert("You must write something!");
    } else {
        // Set the text for newToDo
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Check if dueDate exists, and create due date element
        if (dueDate) {
            const dueDateElement = document.createElement('span');
            dueDateElement.classList.add('due-date-text');
            dueDateElement.innerText = `Due: ${dueDate}`;  // Use template literal properly
            toDoDiv.appendChild(dueDateElement);
        }

        // Add to local storage
        savelocal(toDoInput.value, dueDate);

        // Check button;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        // Delete button;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);

        // Clear inputs;
        toDoInput.value = '';
        dueDateInput.value = '';  // Clear the date input as well
    }
}

function deletecheck(event) {
    const item = event.target;

    // delete
    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");

        // Removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        })
    }

    // check
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
}

// Saving to local storage:
function savelocal(todo, dueDate) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push({ text: todo, dueDate: dueDate });
    // Sort todos by dueDate
    todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    //Check: if items are there;
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

    todos.forEach(function (todoObj) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = todoObj.text;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        if (todoObj.dueDate) {
            const dueDateElement = document.createElement('span');
            dueDateElement.classList.add('due-date-text');
            dueDateElement.innerText = `Due: ${todoObj.dueDate}`;
            toDoDiv.appendChild(dueDateElement);

            const dueDate = new Date(todoObj.dueDate);
            const now = new Date();
            const timeDiff = dueDate - now;

            if (timeDiff < 86400000) {
                dueDateElement.classList.add('highlight');
            }

            if (timeDiff < 0) {
                toDoDiv.classList.add('delayed');
            }
        }

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo) {
    // Check if items are there;
    let todos = JSON.parse(localStorage.getItem('todos'));

    const todoIndex = todos.findIndex(item => item.text === todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? document.getElementById('title').classList.add('darker-title') : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? todo.className = `todo ${color}-todo completed` : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
