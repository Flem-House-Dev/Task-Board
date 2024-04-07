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

// Todo: create a function to generate a unique task id
// function generateTaskId() {
//     let nextId = JSON.parse(localStorage.getItem(tasks.id));
//     return nextId++;
// }

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<h4>').addClass('card-header').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.type);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').attr('data-task-id', task.id).text('Delete');


    // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // TODO: Append the card description, card due date, and card delete button to the card body.
    // TODO: Append the card header and card body to the card.
    cardDescription.appendTo(cardBody);
    cardDueDate.appendTo(cardBody);
    cardDeleteBtn.appendTo(cardBody);
    cardHeader.appendTo(taskCard);
    cardBody.appendTo(taskCard);
    // ? Return the card so it can be appended to the correct lane.
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

    // TODO: Loop through tasks and create task cards for each status
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

    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
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
        // ? Here we use a tool called `crypto` to generate a random id for our task. This is a unique identifier that we can use to find the task in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
        id: crypto.randomUUID(),
        name: taskTitle,
        type: taskDescription,
        dueDate: taskDate,
        status: 'to-do',
    };

    // ? Pull the tasks from localStorage and push the new project to the array
    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    // ? Save the updated tasks array to localStorage
    saveTasksToStorage(tasks);

    // ? Print project data back to the screen
    renderTaskList();

    // TODO: Clear the form inputs
    taskTitleInputEl.val("");
    taskDescriptionInputEl.val("");
    taskDateInputEl.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(this).attr('data-task-id');
    let tasks = readTasksFromStorage();

    // TODO: Loop through the tasks array and remove the task with the matching id.
    tasks = tasks.filter(task => task.id !== taskId);
    // ? We will use our helper function to save the tasks to localStorage
    saveTasksToStorage(tasks);

    // ? Here we use our other function to print tasks back to the screen
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // ? Read tasks from localStorage
    const tasks = readTasksFromStorage();

    // ? Get the task id from the event
    const taskId = ui.draggable[0].dataset.taskId;

    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;

    for (let task of tasks) {
        // ? Find the task card by the `id` and update the task status.
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    // ? Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
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

    // ? Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

