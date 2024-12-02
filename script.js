document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add-button");
    const todoInput = document.getElementById("add-to-do");
    const listContainer = document.querySelector(".main");
    const topSection = document.getElementById("top");

    const API_BASE_URL = "http://127.0.0.1:3001";

    function renderTodoItem(todo) {
        const newListItem = document.createElement("div");
        newListItem.id = "list";
        newListItem.dataset.id = todo.id;

        if (todo.status) {
            newListItem.classList.add("completed");
        }

        newListItem.innerHTML = `
            <div id="mark_container">
                <div id="mark">
                    <input type="checkbox" id="checkbox_${todo.id}" ${
            todo.status ? "checked" : ""
        }>
                    <label for="checkbox_${todo.id}"></label>
                </div>
            </div>
            <div id="content-container">
                <div id="mark-content">
                    <p>${todo.title}</p>
                </div>
            </div>
            <div id="delete-icon">
                <a class="delete-todo-${todo.id}">
                    <img src="assets/trash-bin.png" alt="Delete">
                </a>
            </div>
        `;

        const checkbox = newListItem.querySelector(`#checkbox_${todo.id}`);
        checkbox.addEventListener("change", () =>
            updateTodoStatus(todo.id, checkbox.checked)
        );

        const remove = newListItem.querySelector(`.delete-todo-${todo.id}`);
        remove.addEventListener("click", () => {
            deleteTodos(todo.id);
        });

        listContainer.appendChild(newListItem);
    }

    async function fetchTodos() {
        try {
            const response = await fetch(`${API_BASE_URL}/read`);
            const todos = await response.json();

            console.log("Fetched Todos:", todos);

            const existingTodos = listContainer.querySelectorAll("#list");
            existingTodos.forEach((todo) => todo.remove());

            todos.forEach((todo) => {
                renderTodoItem(todo);
            });
        } catch (error) {
            console.error("Error fetching todos:", error);

            const errorMessage = document.createElement("div");
            errorMessage.style.color = "red";
            errorMessage.textContent =
                "Failed to load todos. Please try again.";
            listContainer.appendChild(errorMessage);
        }
    }

    async function addTodoItem() {
        const todoText = todoInput.value.trim();

        if (todoText === "") return;

        try {
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: todoText,
                    description: todoText,
                    timestamp: Date.now(),
                    status: false,
                }),
            });

            const result = await response.json();

            if (result.status === "Sucess" || result.status === "Success") {
                await fetchTodos();
                todoInput.value = "";
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Error adding todo:", error);
            alert("Failed to add todo");
        }
    }

    addButton.addEventListener("click", addTodoItem);
    todoInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTodoItem();
        }
    });

    async function updateTodoStatus(id, isChecked) {
        try {
            const listItem = document.querySelector(`[data-id='${id}']`);
            const todoTitle = listItem.querySelector("p").textContent;

            const response = await fetch(`${API_BASE_URL}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    title: todoTitle,
                    description: todoTitle,
                    timestamp: Date.now(),
                    status: isChecked,
                }),
            });

            fetchTodos();
        } catch (error) {
            console.error("Error updating todo status:", error);
            alert("Failed to update todo status");
        }
    }

    async function deleteTodos(id) {
        try {
            const listItem = document.querySelector(`[data-id='${id}']`);
            const todoTitle = listItem.querySelector("p").textContent;

            const response = await fetch(`${API_BASE_URL}/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            fetchTodos();
        } catch (error) {
            console.error("Error updating todo status:", error);
            alert("Failed to update todo status");
        }
    }

    fetchTodos();
});
