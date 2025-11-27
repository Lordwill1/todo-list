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

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// Functions;
function addToDo(event) {
  event.preventDefault();
  const todoText = toDoInput.value.trim();
  if (todoText === "") {
    alert("You must write something!");
    return;
  }
  const todoObject = { text: todoText, completed: false };
  savelocal(todoObject);
  renderToDo(todoObject);
  toDoInput.value = "";
}
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
function renderToDo(todo) {
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo", `${savedTheme}-todo`);
  const newToDo = document.createElement("li");
  newToDo.innerText = todo.text;
  newToDo.classList.add("todo-item");
  toDoDiv.appendChild(newToDo);
  const checked = document.createElement("button");
  checked.innerHTML = '<i class="fas fa-check"></i>';
  checked.classList.add("check-btn", `${savedTheme}-button`);
  toDoDiv.appendChild(checked);
  const deleted = document.createElement("button");
  deleted.innerHTML = '<i class="fas fa-trash"></i>';
  deleted.classList.add("delete-btn", `${savedTheme}-button`);
  toDoDiv.appendChild(deleted);
  if (todo.completed) {
    toDoDiv.classList.add("completed");
  }
  toDoList.appendChild(toDoDiv);
}
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
    todos[todoIndex].completed = todoItem.classList.contains("completed");
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}
function deletecheck(event) {
  const item = event.target;
  if (item.classList[0] === "delete-btn") {
    item.parentElement.classList.add("fall");
    removeLocalTodos(item.parentElement);
    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });
  }
  if (item.classList[0] === "check-btn") {
    const todoItem = item.parentElement;
    todoItem.classList.toggle("completed");
    // Find the corresponding todo item in local storage and update its completion status
    updateLocalTodos(todoItem);
  }
}
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
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");
  document.body.className = color;
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");
  document.querySelector("input").className = `${color}-input`;
  document.querySelectorAll(".todo").forEach((todo) => {
    Array.from(todo.classList).some((item) => item === "completed")
      ? (todo.className = `todo ${color}-todo completed`)
      : (todo.className = `todo ${color}-todo`);
  });
  document.querySelectorAll("button").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.className = `check-btn ${color}-button`;
      } else if (item === "delete-btn") {
        button.className = `delete-btn ${color}-button`;
      } else if (item === "todo-btn") {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}
