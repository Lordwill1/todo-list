// --- SELECTORS ---
const toDoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// --- FIRESTORE ---
const db = firebase.firestore();

// --- THEME ON LOAD ---
if (window.changeTheme) {
  let savedTheme = localStorage.getItem('savedTheme');
  savedTheme === null ? window.changeTheme('standard') : window.changeTheme(savedTheme);
} else {
  console.error("Error: window.changeTheme is not defined. Make sure JS/utils.js is loaded correctly.");
}

// --- EVENT LISTENERS ---
if (toDoBtn) toDoBtn.addEventListener('click', addToDo);
if (toDoList) toDoList.addEventListener('click', deletecheck);
if (standardTheme && window.changeTheme) standardTheme.addEventListener('click', () => window.changeTheme('standard'));
if (lightTheme && window.changeTheme) lightTheme.addEventListener('click', () => window.changeTheme('light'));
if (darkerTheme && window.changeTheme) darkerTheme.addEventListener('click', () => window.changeTheme('darker'));

// --- FIREBASE AUTH STATE LISTENER ---
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    listenTodosRealtime(user.uid);
  }
});

// --- REALTIME LISTENER UNTUK TODOS ---
function listenTodosRealtime(uid) {
  db.collection("todos")
    .where("uid", "==", uid)
    .orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
      if (toDoList) {
        toDoList.innerHTML = "";
        snapshot.forEach((doc) => {
          renderTodo(doc);
        });
      }
    });
}

// --- RENDER TODO (1 item) ---
function renderTodo(doc) {
  const data = doc.data();
  const currentTheme = localStorage.getItem('savedTheme') || 'standard';

  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo", `${currentTheme}-todo`);
  toDoDiv.setAttribute('data-id', doc.id);
  if (data.completed) toDoDiv.classList.add("completed");

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('todo-row');

  const newToDo = document.createElement('li');
  newToDo.innerText = data.text;
  newToDo.classList.add('todo-item');
  rowDiv.appendChild(newToDo);

  const deadline = document.createElement('span');
  deadline.classList.add('todo-deadline');
  deadline.innerText = window.formatDate ? window.formatDate(data.date) : data.date;
  rowDiv.appendChild(deadline);

  const checked = document.createElement('button');
  checked.innerHTML = '<i class="fas fa-check"></i>';
  checked.classList.add('check-btn', `${currentTheme}-button`);
  rowDiv.appendChild(checked);

  const deleted = document.createElement('button');
  deleted.innerHTML = '<i class="fas fa-trash"></i>';
  deleted.classList.add('delete-btn', `${currentTheme}-button`);
  rowDiv.appendChild(deleted);

  toDoDiv.appendChild(rowDiv);
  if (toDoList) {
    toDoList.appendChild(toDoDiv);
  } else {
    console.error("Error: toDoList is not defined. Cannot append todo item.");
  }
}

// --- ADD TODO ---
function addToDo(event) {
  if (event?.preventDefault) event.preventDefault();

  const taskText = toDoInput.value.trim();
  const taskDate = todoDate.value;
  const user = firebase.auth().currentUser;

  if (!user) {
    alert("Kamu harus login!");
    return;
  }
  if (!taskText || !taskDate) {
    alert("Isi task dan tanggalnya!");
    return;
  }

  db.collection("todos").add({
    uid: user.uid,
    text: taskText,
    date: taskDate,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    toDoInput.value = '';
    todoDate.value = '';
  }).catch(error => {
    console.error("Error adding todo:", error);
    alert("Gagal menambahkan tugas.");
  });
}

// --- DELETE OR CHECK ---
function deletecheck(event) {
  const item = event.target;
  const todo = item.closest('.todo');
  if (!todo) return;

  const docId = todo.getAttribute('data-id');
  if (!docId) return;

  if (item.classList.contains('delete-btn')) {
    db.collection("todos").doc(docId).delete().catch(error => {
      console.error("Error deleting todo:", error);
      alert("Gagal menghapus tugas.");
    });
  }

  if (item.classList.contains('check-btn')) {
    const isCompleted = todo.classList.contains("completed");
    db.collection("todos").doc(docId).update({
      completed: !isCompleted
    }).then(() => {
      todo.classList.toggle("completed");
    }).catch(error => {
      console.error("Error updating todo completion status:", error);
      alert("Gagal memperbarui status tugas.");
    });
  }
}

// --- EXPORT TO WINDOW GLOBAL ---
window.addToDo = addToDo;
window.deletecheck = deletecheck;
window.renderTodo = renderTodo;
window.listenTodosRealtime = listenTodosRealtime;
