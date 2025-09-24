$(document).ready(function() {
    let tasks = [];
    const taskList = $('#taskList');

    // Load tasks from local storage
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }

    // Add a new task
    $('#addTaskBtn').on('click', function() {
        const taskText = $('#taskInput').val().trim();
        if (taskText !== '') {
            tasks.push({
                text: taskText,
                completed: false
            });
            $('#taskInput').val('');
            saveAndRender();
        }
    });

    // Handle Enter key press on input
    $('#taskInput').on('keypress', function(e) {
        if (e.which === 13) {
            $('#addTaskBtn').click();
        }
    });

    // Handle various actions on the task list (delegation)
    taskList.on('click', '.delete-btn', function() {
        const index = $(this).data('index');
        tasks.splice(index, 1);
        saveAndRender();
    });

    taskList.on('click', '.form-check-input', function() {
        const index = $(this).closest('.list-group-item').data('index');
        tasks[index].completed = $(this).prop('checked');
        saveAndRender();
    });

    // Enable editing on double-click
    taskList.on('dblclick', '.task-text', function() {
        const listItem = $(this).closest('.list-group-item');
        listItem.addClass('edit-mode');
        const input = listItem.find('.edit-input');
        input.val($(this).text());
        input.focus();
    });

    // Save edited task on blur or Enter
    taskList.on('blur', '.edit-input', function() {
        saveEditedTask($(this));
    });

    taskList.on('keypress', '.edit-input', function(e) {
        if (e.which === 13) {
            saveEditedTask($(this));
        }
    });

    // Filter tasks
    $('.btn-sm').on('click', function() {
        $('.active-filter').removeClass('active-filter');
        $(this).addClass('active-filter');
        renderTasks();
    });

    // --- Helper Functions ---
    
    function saveEditedTask(inputElement) {
        const listItem = inputElement.closest('.list-group-item');
        const index = listItem.data('index');
        const newText = inputElement.val().trim();
        if (newText !== '') {
            tasks[index].text = newText;
            listItem.removeClass('edit-mode');
            saveAndRender();
        } else {
            // Revert to original text if input is empty
            listItem.removeClass('edit-mode');
            renderTasks();
        }
    }

    function renderTasks() {
        taskList.empty();
        const activeFilter = $('.active-filter').data('filter');

        tasks.forEach((task, index) => {
            let shouldRender = true;
            if (activeFilter === 'active' && task.completed) {
                shouldRender = false;
            } else if (activeFilter === 'completed' && !task.completed) {
                shouldRender = false;
            }

            if (shouldRender) {
                const checked = task.completed ? 'checked' : '';
                const completedClass = task.completed ? 'completed' : '';
                const taskItem = `
                    <li class="list-group-item ${completedClass}" data-index="${index}">
                        <div class="d-flex align-items-center flex-grow-1">
                            <input class="form-check-input me-3" type="checkbox" ${checked}>
                            <span class="task-text">${task.text}</span>
                            <input type="text" class="form-control edit-input">
                        </div>
                        <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                    </li>`;
                taskList.append(taskItem);
            }
        });
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});