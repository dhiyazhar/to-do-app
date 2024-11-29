document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-button');
    const todoInput = document.getElementById('add-to-do');
    const listContainer = document.querySelector('.main');

    addButton.addEventListener('click', addTodoItem);
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodoItem();
        }
    });

    function addTodoItem() {
        const todoText = todoInput.value.trim();
        
        if (todoText === '') return;

        const newListItem = document.createElement('div');
        newListItem.id = 'list';
        newListItem.innerHTML = `
            <div id="mark_container">
                <div id="mark">
                    <input type="checkbox" id="checkbox_${Date.now()}">
                    <label for="checkbox_${Date.now()}"></label>
                </div>
            </div>
            <div id="content-container">
                <div id="mark-content">
                    <p>${todoText}</p>
                </div>
            </div>
            <div id="delete-icon">
                <a href="#" class="delete-todo">
                    <img src="assets/trash-bin.png" alt="Delete">
                </a>
            </div>
        `;

        const checkbox = newListItem.querySelector('input[type="checkbox"]');
    
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                newListItem.classList.add('completed');
            } else {
                newListItem.classList.remove('completed');
            }
        });

        const deleteLink = newListItem.querySelector('.delete-todo');
        deleteLink.addEventListener('click', (event) => {
            event.preventDefault();
            newListItem.remove();
        });

        const topSection = document.getElementById('top');
        listContainer.insertBefore(newListItem, topSection.nextSibling);

        todoInput.value = '';
    }
});