document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-button');
    const todoInput = document.getElementById('add-to-do');
    const listContainer = document.querySelector('.main');
    const topSection = document.getElementById('top');

    // Backend API endpoint
    const API_BASE_URL = 'http://172.16.16.28:3001';

    // Render todo item to DOM
    function renderTodoItem(todo) {
        const newListItem = document.createElement('div');
        newListItem.id = 'list';
        newListItem.dataset.id = todo.id;
    
        // Tambahkan class "completed" kalau status-nya true
        if (todo.status) {
            newListItem.classList.add('completed');
        }
    
        newListItem.innerHTML = `
            <div id="mark_container">
                <div id="mark">
                    <input type="checkbox" id="checkbox_${todo.id}" ${todo.status ? 'checked' : ''}>
                    <label for="checkbox_${todo.id}"></label>
                </div>
            </div>
            <div id="content-container">
                <div id="mark-content">
                    <p>${todo.title}</p>
                </div>
            </div>
            <div id="delete-icon">
                <a href="#" class="delete-todo">
                    <img src="assets/trash-bin.png" alt="Delete">
                </a>
            </div>
        `;
    
        // Event listener untuk update status
        const checkbox = newListItem.querySelector(`#checkbox_${todo.id}`);
        checkbox.addEventListener('change', () => updateTodoStatus(todo.id, checkbox.checked));
    
        listContainer.appendChild(newListItem);
    }
    
    
    // Fetch and display existing todos
    async function fetchTodos() {
        try {
            const response = await fetch(`${API_BASE_URL}/read`);
            const todos = await response.json();
            
            console.log('Fetched Todos:', todos);
            
            // Clear existing todo items before rendering
            const existingTodos = listContainer.querySelectorAll('#list');
            existingTodos.forEach(todo => todo.remove());
            
            todos.forEach(todo => {
                renderTodoItem(todo);
            });
        } catch (error) {
            console.error('Error fetching todos:', error);
            
            // Display error message to user
            const errorMessage = document.createElement('div');
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Failed to load todos. Please try again.';
            listContainer.appendChild(errorMessage);
        }
    }

    // Add new todo
    async function addTodoItem() {
        const todoText = todoInput.value.trim();
        
        if (todoText === '') return;

        try {
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: todoText,
                    description: todoText,
                    timestamp: Date.now(),
                    status: false
                })
            });

            const result = await response.json();
            
            if (result.status === 'Sucess' || result.status === 'Success') {
                // Refresh todos
                await fetchTodos();
                todoInput.value = '';
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add todo');
        }
    }

    // Event listeners
    addButton.addEventListener('click', addTodoItem);
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodoItem();
        }
    });

    async function updateTodoStatus(id, isChecked) {
        try {
            // Cari elemen todo berdasarkan ID
            const listItem = document.querySelector(`[data-id='${id}']`);
            const todoTitle = listItem.querySelector('p').textContent;
    
            // Kirim data lengkap ke backend
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    title: todoTitle,
                    description: todoTitle, // Bisa disesuaikan
                    timestamp: Date.now(),  // Bisa ambil timestamp lama kalau dibutuhkan
                    status: isChecked,
                }),
            });
    
            const result = await response.json();
    
            if (result.status === 'Success') {
                // Update class CSS sesuai status
                if (isChecked) {
                    listItem.classList.add('completed');
                } else {
                    listItem.classList.remove('completed');
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error updating todo status:', error);
            alert('Failed to update todo status');
        }
    }

    // Initial fetch of todos
    fetchTodos();
});