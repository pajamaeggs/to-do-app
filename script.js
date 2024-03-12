function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskNumber = parseFloat(document.getElementById('taskNumber').value);
    const selectedColumns = document.querySelectorAll("input[name='column']:checked");

    if(taskInput.value.trim() !== '' && !isNaN(taskNumber) && selectedColumns.length > 0) {
        selectedColumns.forEach(checkbox => {
            const columnId = checkbox.value;
            const task = { description: taskInput.value, number: taskNumber.toFixed(2) };

            // Add task to local storage
            const storedTasks = JSON.parse(localStorage.getItem(columnId)) || [];
            storedTasks.push(task);
            localStorage.setItem(columnId, JSON.stringify(storedTasks));

            // Add task to UI
            addTaskToColumn(columnId, task);
        });
        
        // Reset input fields
        taskInput.value = '';
        document.getElementById('taskNumber').value = '';
        selectedColumns.forEach(checkbox => checkbox.checked = false);

        updateColumnTotals();
    } else {
        alert("Please fill in the task description, its number, and select at least one column.");
    }
}

function addTaskToColumn(columnId, task) {
    const ul = document.querySelector(`#${columnId} ul`);
    const li = document.createElement('li');
    li.textContent = `${task.description} - ${task.number}`;

    // Optional: Add functionality to remove tasks
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        li.remove();
        removeTaskFromColumn(columnId, task);
        updateColumnTotals();
    };
    li.appendChild(removeButton);

    ul.appendChild(li);
}

function removeTaskFromColumn(columnId, task) {
    const storedTasks = JSON.parse(localStorage.getItem(columnId)) || [];
    const newStoredTasks = storedTasks.filter(storedTask => !(storedTask.description === task.description && storedTask.number === task.number));
    localStorage.setItem(columnId, JSON.stringify(newStoredTasks));
}

function loadTasks() {
    const columnIds = ["column1", "column2", "column3", "column4", "column5"];
    columnIds.forEach(columnId => {
        const storedTasks = JSON.parse(localStorage.getItem(columnId)) || [];
        storedTasks.forEach(task => {
            addTaskToColumn(columnId, task);
        });
    });

    updateColumnTotals();
}

// Load tasks at page load
window.onload = loadTasks;

// This function toggles all columns checkboxes checked state
function toggleColumns(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll("input[name='column']");
    checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
}

// Add the event listener for change to uncheck Select All if any column checkbox is unchecked
document.querySelectorAll("input[name='column']").forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if(!checkbox.checked) {
            document.getElementById("selectAll").checked = false;
        }
    });
});

function loadTasks() {
    const columnIds = ["column1", "column2", "column3", "column4", "column5"];
    columnIds.forEach(columnId => {
        const storedTasks = JSON.parse(localStorage.getItem(columnId)) || [];
        storedTasks.forEach(task => {
            addTaskToColumn(columnId, task);
        });

        // Apply the SortableJS library to each column
        new Sortable(document.querySelector(`#${columnId} ul`), {
            animation: 150, // Animation when moving items
            onEnd: () => {
                // Save the sorted order of tasks to localStorage when drag and drop ends
                const sortedTasks = Array.from(document.querySelector(`#${columnId} ul`).children).map(li => ({
                    description: li.textContent.split(" - ")[0], 
                    number: parseFloat(li.textContent.split(" - ")[1])
                }));
                localStorage.setItem(columnId, JSON.stringify(sortedTasks));
            }
        });
    });

    updateColumnTotals();
}
