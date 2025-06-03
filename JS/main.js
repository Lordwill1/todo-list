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
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// --- EVENT LISTENERS ---
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// --- FIREBASE AUTH STATE ---
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        listenTodosRealtime(user.uid);
    }
});

// --- REALTIME LISTENER ---
function listenTodosRealtime(uid) {
    db.collection("todos")
      .where("uid", "==", uid)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        toDoList.innerHTML = "";
        snapshot.forEach((doc) => {
            renderTodo(doc);
        });
      });
}

// --- RENDER TODO (1 item) ---
function renderTodo(doc) {
    const data = doc.data();

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    toDoDiv.setAttribute('data-id', doc.id);

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('todo-row');

    const newToDo = document.createElement('li');
    newToDo.innerText = data.text;
    newToDo.classList.add('todo-item');
    rowDiv.appendChild(newToDo);

    const deadline = document.createElement('span');
    deadline.classList.add('todo-deadline');
    deadline.innerText = formatDate(data.date);
    rowDiv.appendChild(deadline);

    // Tombol checklist (UI only)
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    rowDiv.appendChild(checked);

    // Tombol hapus
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    rowDiv.appendChild(deleted);

    toDoDiv.appendChild(rowDiv);
    toDoList.appendChild(toDoDiv);
}

// --- ADD TODO ---
function addToDo(event) {
    event.preventDefault();

    const taskText = toDoInput.value.trim();
    const taskDate = todoDate.value;
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Kamu harus login!");
        return;
    }
    if (taskText === '' || taskDate === '') {
        alert("Isi task dan tanggalnya!");
        return;
    }

    db.collection("todos").add({
        uid: user.uid,
        text: taskText,
        date: taskDate,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        toDoInput.value = '';
        todoDate.value = '';
        // UI langsung update karena listenTodosRealtime()
    });
}

// --- DELETE OR CHECK ---
function deletecheck(event) {
    const item = event.target;
    const todo = item.closest('.todo');
    if (!todo) return;

    // Hapus dari Firestore jika klik tombol hapus
    if (item.classList.contains('delete-btn')) {
        const docId = todo.getAttribute('data-id');
        if (docId) {
            db.collection("todos").doc(docId).delete();
            // UI langsung update karena listenTodosRealtime()
        }
    }

    // Checklist (hanya efek visual)
    if (item.classList.contains('check-btn')) {
        todo.classList.toggle("completed");
    }
}
