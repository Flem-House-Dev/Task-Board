// let taskList = JSON.parse(localStorage.getItem("tasks"));

$('input').attr('autocomplete', 'off');


let taskList = JSON.parse(localStorage.getItem("tasks"));
if (!Array.isArray(taskList)) {
  taskList = [];
}
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Create a task card
function createTaskCard(task) {
  let card = document.createElement('div');
  card.textContent = task.title;
  card.id = task.id;
  return card;
}

// Render the task list and make cards draggable
function renderTaskList() {
  let todoCards = document.getElementById('todo-cards');
  let inProgressCards = document.getElementById('in-progress-cards');
  let doneCards = document.getElementById('done-cards');

  todoCards.innerHTML = '';
  inProgressCards.innerHTML = '';
  doneCards.innerHTML = '';

  for (let task of taskList) {
    let card = createTaskCard(task);
    if (task.status === 'to-do') {
      todoCards.appendChild(card);
    } else if (task.status === 'in-progress') {
      inProgressCards.appendChild(card);
    } else if (task.status === 'done') {
      doneCards.appendChild(card);
    }
  }

  $('.card').draggable();
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  let taskTitle = document.querySelector('#task-title');
  let taskDate = document.querySelector('#task-date');
  let taskDescription = document.querySelector('#task-description');

  let task = {
    id: generateTaskId(),
    title: taskTitle.value,
    dueDate: taskDate.value,
    description: taskDescription.value,
    status: 'to-do'
  };

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  localStorage.setItem('nextId', nextId);

  createTaskCard(taskTitle);
  renderTaskList();
}

// Handle deleting a task
function handleDeleteTask(event) {
  let id = parseInt(event.target.parentElement.id);
  taskList = taskList.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  renderTaskList();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let id = parseInt(ui.draggable[0].id);
  let status = event.target.id.split('-')[0];

  let task = taskList.find(task => task.id === id);
  task.status = status;
  localStorage.setItem('tasks', JSON.stringify(taskList));

  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $('#add-task-form').on('submit', handleAddTask);
  $('.delete-button').on('click', handleDeleteTask);

  $('.lane').droppable({
    drop: handleDrop
  });

  $('#task-date').datepicker();
});


//   --------------------------------------------------------------

// let  form,
//     task = $('#task-title'),
//     taskDueDate = $('#task-date'),
//     taskDescription = $('#task-description'),
//     allFields = $( [] ).add( task ).add( taskDueDate ).add( taskDescription );

// dialog = 
//     $("#dialog").dialog({
//         autoOpen: false,
//         height: 400,
//         width: 350
//         // modal: true

//     });

// -------------------------------------------------

// $(document).ready(function () {
//   // Assuming you have a form with an ID, e.g., "my-form"
//   $("#my-form").submit(function (event) {
//     event.preventDefault(); // Prevent the form from submitting normally

//     // Create the HTML elements to be appended
//     let cardHeader = '<div class="card-header">Featured</div>';
//     let cardBody = '<div class="card-body">' +
//       '<h5 class="card-title">Special title treatment</h5>' +
//       '<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>' +
//       '<a href="#" class="btn btn-primary">Go somewhere</a>' +
//       '</div>';

//     // Append the elements to the div with ID "to-do"
//     $("#to-do").append(cardHeader + cardBody);
//   });
// });
