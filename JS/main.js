// Selectors

const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");

// Event Listeners

toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);

standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

// Check saved theme

let savedTheme = localStorage.getItem("savedTheme");

savedTheme === null
  ? changeTheme("standard")
  : changeTheme(savedTheme);

// Functions

function addToDo(event) {
  event.preventDefault();

  const todoText = toDoInput.value.trim();

  if (todoText === "") {
    alert("You must write something!");
    return;
  }

  const todoObject = {
    text: todoText,
    completed: false
  };

  savelocal(todoObject);
  renderToDo(todoObject);

  toDoInput.value = "";
}


// Save tasks to Local Storage

function savelocal(todoObj) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todoObj);

  localStorage.setItem("todos", JSON.stringify(todos));
}


// Load saved tasks

function getTodos() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach((todo) => {
    renderToDo(todo);
  });
}


// Display task

function renderToDo(todo) {
  const toDoDiv = document.createElement("div");

  toDoDiv.classList.add("todo", `${savedTheme}-todo`);

  const newToDo = document.createElement("li");

  newToDo.innerText = todo.text;
  newToDo.classList.add("todo-item");

  toDoDiv.appendChild(newToDo);


  // Check button

  const checked = document.createElement("button");

  checked.innerHTML = '<i class="fas fa-check"></i>';

  checked.classList.add("check-btn", `${savedTheme}-button`);

  toDoDiv.appendChild(checked);


  // Edit button - NEW

  const editButton = document.createElement("button");

  editButton.innerHTML = '<i class="fas fa-edit"></i>';

  editButton.classList.add("edit-btn", `${savedTheme}-button`);

  toDoDiv.appendChild(editButton);


  // Delete button

  const deleted = document.createElement("button");

  deleted.innerHTML = '<i class="fas fa-trash"></i>';

  deleted.classList.add("delete-btn", `${savedTheme}-button`);

  toDoDiv.appendChild(deleted);


  // Completed task

  if (todo.completed) {
    toDoDiv.classList.add("completed");
  }

  toDoList.appendChild(toDoDiv);
}


// Update completed status

function updateLocalTodos(todoItem) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todos.findIndex(
    (item) => item.text === todoItem.children[0].innerText
  );

  if (todoIndex !== -1) {
    todos[todoIndex].completed =
      todoItem.classList.contains("completed");

    localStorage.setItem("todos", JSON.stringify(todos));
  }
}


// Handle buttons

function deletecheck(event) {

  // Get the actual button, even if the icon is clicked

  const item = event.target.closest("button");

  if (!item) return;


  // Delete task

  if (item.classList.contains("delete-btn")) {

    const todoItem = item.parentElement;

    todoItem.classList.add("fall");

    removeLocalTodos(todoItem);

    todoItem.addEventListener("transitionend", function () {
      todoItem.remove();
    });
  }


  // Complete task

  if (item.classList.contains("check-btn")) {

    const todoItem = item.parentElement;

    todoItem.classList.toggle("completed");

    updateLocalTodos(todoItem);
  }


  // Edit task - NEW

  if (item.classList.contains("edit-btn")) {

    const todoItem = item.parentElement;

    const oldText = todoItem.children[0].innerText;

    const updatedText = prompt("Edit your task:", oldText);

    if (updatedText !== null && updatedText.trim() !== "") {

      const newText = updatedText.trim();

      todoItem.children[0].innerText = newText;

      updateEditedTodo(oldText, newText);
    }
  }
}


// Update edited task in Local Storage - NEW

function updateEditedTodo(oldText, newText) {

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const todoIndex = todos.findIndex(
    (todo) => todo.text === oldText
  );

  if (todoIndex !== -1) {

    todos[todoIndex].text = newText;

    localStorage.setItem("todos", JSON.stringify(todos));
  }
}


// Delete task from Local Storage

function removeLocalTodos(todo) {

  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todos.findIndex(
    (item) => item.text === todo.children[0].innerText
  );

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
  }

  localStorage.setItem("todos", JSON.stringify(todos));
}


// Change theme

function changeTheme(color) {

  localStorage.setItem("savedTheme", color);

  savedTheme = localStorage.getItem("savedTheme");

  document.body.className = color;

  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").className = `${color}-input`;


  // Update task themes

  document.querySelectorAll(".todo").forEach((todo) => {

    Array.from(todo.classList).some((item) => item === "completed")

      ? (todo.className = `todo ${color}-todo completed`)

      : (todo.className = `todo ${color}-todo`);
  });


  // Update button themes

  document.querySelectorAll("button").forEach((button) => {

    Array.from(button.classList).some((item) => {

      if (item === "check-btn") {

        button.className = `check-btn ${color}-button`;

      } else if (item === "delete-btn") {

        button.className = `delete-btn ${color}-button`;

      } else if (item === "edit-btn") {

        button.className = `edit-btn ${color}-button`;

      } else if (item === "todo-btn") {

        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}