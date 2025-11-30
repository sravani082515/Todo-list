// Global array to hold the current state of the todo list
let todos = [];
const STORAGE_KEY = 'enhancedTodos';

// --- DOM Element References ---
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

// --- I. LOCAL STORAGE UTILITIES ---

/**
 * Loads the tasks array from localStorage.
 * Initializes the todos array if no data is found.
 */
function loadTasks() {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
        // Parse the JSON string back into a JavaScript array
        todos = JSON.parse(storedTodos);
    } else {
        todos = [];
    }
}

/**
 * Saves the current todos array to localStorage as a JSON string.
 */
function saveTasks() {
    // Stringify the JavaScript array into a JSON string before saving
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// --- II. RENDERING FUNCTIONS ---

/**
 * Renders the entire list of tasks to the DOM based on the current 'todos' array.
 * This function also handles the search filter if a query is present.
 */
function renderTasks() {
    taskList.innerHTML = ''; // Clear existing list items
    const searchQuery = searchInput.value.toLowerCase();

    todos.forEach(task => {
        // Create the list item element
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id;

        // Check for search match
        const matchesSearch = task.text.toLowerCase().includes(searchQuery);
        if (!matchesSearch) {
            listItem.classList.add('hidden'); // Hide non-matching tasks
        }

        // Add 'completed' class if the task is done
        if (task.completed) {
            listItem.classList.add('completed');
        }

        // 1. Task Text Element
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.classList.add('task-text');
        
        // Add event listener to toggle completion status on text click
        taskText.addEventListener('click', () => toggleTaskCompletion(task.id));

        // 2. Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖'; // Unicode character for 'X'
        deleteBtn.classList.add('delete-btn');
        
        // Add event listener to remove the task
        deleteBtn.addEventListener('click', () => removeTask(task.id));

        // Append elements to the list item
        listItem.appendChild(taskText);
        listItem.appendChild(deleteBtn);
        
        // Append the list item to the main list
        taskList.appendChild(listItem);
    });
}

// --- III. CRUD (CREATE, UPDATE, DELETE) LOGIC ---

/**
 * Creates a new task object and adds it to the todos array.
 */
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Task description cannot be empty!");
        return;
    }

    // Generate a simple unique ID (timestamp is sufficient for a local app)
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    // Add the new task to the array
    todos.push(newTask);

    // Save the updated array to localStorage
    saveTasks();

    // Re-render the list to show the new task
    renderTasks();

    // Clear the input field
    taskInput.value = '';
}

/**
 * Toggles the 'completed' status of a task by its ID.
 * @param {number} id The unique ID of the task to toggle.
 */
function toggleTaskCompletion(id) {
    // Find the task in the array and flip its completed status
    const taskIndex = todos.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        todos[taskIndex].completed = !todos[taskIndex].completed;
        saveTasks();    // Save changes
        renderTasks();  // Re-render to update the visual status
    }
}

/**
 * Removes a task from the todos array by its ID.
 * @param {number} id The unique ID of the task to remove.
 */
function removeTask(id) {
    // Filter out the task with the matching ID
    todos = todos.filter(task => task.id !== id);
    saveTasks();    // Save changes
    renderTasks();  // Re-render the list
}

// --- IV. INITIALIZATION & EVENT LISTENERS ---

/**
 * Sets up all required event listeners.
 */
function setupEventListeners() {
    // Add task on button click
    addTaskBtn.addEventListener('click', addTask);
    
    // Add task on Enter key press in the input field
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Real-time search by re-rendering the list whenever the search input changes
    searchInput.addEventListener('input', renderTasks);
}

// Initial application setup
function init() {
    // 1. Load data from localStorage first
    loadTasks();
    
    // 2. Render the tasks found in localStorage
    renderTasks();
    
    // 3. Set up listeners for interactivity
    setupEventListeners();
}

// Run the initialization function when the script loads
init();
