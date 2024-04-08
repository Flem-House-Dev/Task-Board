// ? Grab references to the important DOM elements.
const projectDisplayEl = $('#project-display');
const taskFormEl = $('#add-task-form');
const taskTitleInputEl = $('#task-title-input');
const taskDescriptionInputEl = $('#task-description');
const taskDateInputEl = $('#task-date-input');

// Retrieve tasks and nextId from localStorage

function readTasksFromStorage() {
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    if (!Array.isArray(taskList)) {
        taskList = [];
    }
    return taskList;
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<h4>').addClass('card-header').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.type);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').attr('data-task-id', task.id).text('Delete');

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardDescription.appendTo(cardBody);
    cardDueDate.appendTo(cardBody);
    cardDeleteBtn.appendTo(cardBody);
    cardHeader.appendTo(taskCard);
    cardBody.appendTo(taskCard);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();
    console.log(tasks);

    // ? Empty existing task cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        const card = createTaskCard(task);
        switch (task.status) {
            case 'to-do':
                todoList.append(card);
                break;
            case 'in-progress':
                inProgressList.append(card);
                break;
            case 'done':
                doneList.append(card);
                break;
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,

        helper: function (e) {

            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    // TODO: Get the task name, type, and due date from the form
    const taskTitle = taskTitleInputEl.val();
    const taskDescription = taskDescriptionInputEl.val();
    const taskDate = taskDateInputEl.val();

    // ? Create a new task object with the data from the form
    const newTask = {

        id: crypto.randomUUID(),
        name: taskTitle,
        type: taskDescription,
        dueDate: taskDate,
        status: 'to-do',
    };

    const tasks = readTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTaskList();

    taskTitleInputEl.val("");
    taskDescriptionInputEl.val("");
    taskDateInputEl.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(this).attr('data-task-id');
    let tasks = readTasksFromStorage();

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasksToStorage(tasks);
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {

        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

taskFormEl.on('submit', handleAddTask);
projectDisplayEl.on('click', '.delete', handleDeleteTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#task-date-input').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

