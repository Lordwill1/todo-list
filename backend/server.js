const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Auto-create db.json file
if (!fs.existsSync("db.json")) {
    fs.writeFileSync("db.json", "[]");
    console.log("db.json created automatically");
}

// Load todos from db.json
function loadTodos() {
    if (!fs.existsSync("db.json")) return [];
    return JSON.parse(fs.readFileSync("db.json"));
}

// Save todos
function saveTodos(todos) {
    fs.writeFileSync("db.json", JSON.stringify(todos, null, 2));
}

// ========== ROUTES ==========

// Get all todos
app.get("/todos", (req, res) => {
    res.json(loadTodos());
});

// Add todo
app.post("/todos", (req, res) => {
    const todos = loadTodos();
    const todo = {
        id: Date.now(),
        text: req.body.text,
        category: req.body.category,
        completed: false,
        reminderAt: req.body.reminderAt || null
    };
    todos.push(todo);
    saveTodos(todos);
    res.json(todo);
});

// Delete todo
app.delete("/todos/:id", (req, res) => {
    let todos = loadTodos();
    todos = todos.filter(t => t.id != req.params.id);
    saveTodos(todos);
    res.json({ success: true });
});

// Update todo (editing)
app.put("/todos/:id", (req, res) => {
    let todos = loadTodos();
    const todo = todos.find(t => t.id == req.params.id);
    if (!todo) return res.json({ error: "Not found" });

    todo.text = req.body.text || todo.text;
    todo.category = req.body.category || todo.category;

    saveTodos(todos);
    res.json(todo);
});

// Mark complete
app.put("/todos/:id/complete", (req, res) => {
    let todos = loadTodos();
    const todo = todos.find(t => t.id == req.params.id);
    if (!todo) return res.json({ error: "Not found" });

    todo.completed = !todo.completed;
    saveTodos(todos);
    res.json(todo);
});

// ========== REMINDER SCHEDULER ==========
setInterval(() => {
    const todos = loadTodos();
    const now = Date.now();

    todos.forEach(todo => {
        if (todo.reminderAt && new Date(todo.reminderAt).getTime() <= now) {
            console.log("REMINDER:", todo.text);
            todo.reminderAt = null;
        }
    });

    saveTodos(todos);
}, 60 * 1000); // every 1 minute

// Start server
app.listen(4000, () => console.log("Backend running on port 4000"));