import './style.css'
import type { 
  Todo, 
  Priority,
  Category, 
  FilterType, 
  EditState 
} from './types'

// DOM Elements with Type Casting
const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement | null;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement | null;
const todoList = document.querySelector('.todo-list') as HTMLUListElement | null;
const errorMessage = document.getElementById('error-message') as HTMLDivElement | null;


// Statistics DOM elements - defined once as top-level constants
const totalTodosElement = document.getElementById('total-todos') as HTMLDivElement | null;
const completedTodosElement = document.getElementById('completed-todos') as HTMLDivElement | null;
const progressPercentElement = document.getElementById('progress-percent') as HTMLDivElement | null;




// State Management with Type Annotations
let todos: Todo[] = [];
let currentFilter: FilterType = 'all';
let editState: EditState = {
    isEditing: false,
    editingId: null,
    originalText: ''
};



// Statistics calculation interface for type safety
interface TodoStats {
    total: number;
    completed: number;
    percentage: number;
}

// Pure function for calculating statistics - separated from DOM logic
const calculateStats = (todoList: Todo[]): TodoStats => {
    const total = todoList.length;
    const completed = todoList.filter(todo => todo.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
};



// Get priority from radio buttons with type safety
const getSelectedPriority = (): Priority => {
    const selected = document.querySelector('input[name="priority"]:checked') as HTMLInputElement;
    return selected?.value as Priority || 'medium';
};


// Add Todo Function
const addTodo = (text: string, category: Category, priority: Priority, dueDate?: Date): void => {
    // Create new todo object with all required properties
    const newTodo: Todo = {
        id: Date.now(), // Simple ID generation for demo
        text: text.trim(),
        completed: false,
        category,
        priority,
        dueDate,
        createdAt: new Date()
    };
    
    // Add to todos array (immutable approach for better testing)
    todos = [...todos, newTodo];
    
    console.log('New todo added:', newTodo);
    console.log('Total todos:', todos.length);
    
    // Update statistics after adding todo
    updateStats();
    
    // TODO: Add saveTodos(), renderTodos() in future branches
};


// Form validation function
const validateTodoInput = (text: string): boolean => {
    const trimmedText = text.trim();
    
    if (trimmedText === '') {
        showError('Please enter a TypeScript concept to learn!');
        return false;
    }
    
    if (trimmedText.length < 3) {
        showError('Concept name must be at least 3 characters long!');
        return false;
    }
    
    hideError();
    return true;
};

// Error message helper functions
const showError = (message: string): void => {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
};

const hideError = (): void => {
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
};


// Form submission handler with full type safety
const initializeForm = (): void => {
    if (!todoForm || !todoInput || !categorySelect || !dueDateInput) {
        console.error('Required form elements not found');
        return;
    }

    todoForm.addEventListener('submit', (event: Event) => {
        event.preventDefault(); // Prevent page reload
        
        // Get form values with type casting
        const text = todoInput.value.trim();
        const category = categorySelect.value as Category;
        const priority = getSelectedPriority();
        const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : undefined;
        
        // Validate input
        if (!validateTodoInput(text)) {
            todoInput.focus();
            return;
        }
        
        // Add the todo
        addTodo(text, category, priority, dueDate);
        
        // Reset form after successful submission
        todoForm.reset();
        // Reset priority to default (medium)
        const mediumRadio = document.querySelector('input[name="priority"][value="medium"]') as HTMLInputElement;
        if (mediumRadio) mediumRadio.checked = true;
        
        // Focus back to input for next entry
        todoInput.focus();
        
        console.log('Form submitted successfully');
    });
};


// Update Statistics Function
const updateStats = (): void => {
    // Calculate statistics using pure function
    const stats = calculateStats(todos);
    
    // Update DOM elements with null checks
    if (totalTodosElement) totalTodosElement.textContent = stats.total.toString();
    if (completedTodosElement) completedTodosElement.textContent = stats.completed.toString();
    if (progressPercentElement) progressPercentElement.textContent = `${stats.percentage}%`;

    console.log('Stats updated:', stats);
};



// Filter Todos Function
const filterTodos = (filter: FilterType): void => {
   // currentFilter = filter;
    // TODO: Add renderTodos() call in next feature branch
    
    // Update active filter button styling
    updateFilterButtonStyling(filter);
    
    console.log('Filter changed to:', filter);
};


// Filter Button Styling
const updateFilterButtonStyling = (activeFilter: FilterType): void => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter') as FilterType;
        
        if (btnFilter === activeFilter) {
            btn.classList.add('border-light-border', 'bg-light-border', 'text-light-bg');
        } else {
            btn.classList.remove('bg-light-border', 'text-light-bg');
            btn.classList.add('border-light-border');
        }
    });
};


// Get Filtered Todos Function
//will make sense later
/* const getFilteredTodos = (): Todo[] => {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'critical':
            return todos.filter(todo => todo.priority === 'critical');
        default:
            return todos;
    }
}; */

// Initialize Filter Event Listeners
const initializeFilterButtons = (): void => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const filter = (event.target as HTMLButtonElement).dataset.filter as FilterType;
            filterTodos(filter);
        });
    });
};


// Toggle All Todos Function
const toggleAllTodos = (): void => {
    const allCompleted = todos.every(todo => todo.completed);
    todos = todos.map(todo => ({
        ...todo,
        completed: !allCompleted
    }));
    
    updateStats();
    
    console.log('Toggled all todos. All completed:', !allCompleted);
    
    // TODO: Add saveTodos(), renderTodos() in future branches
};


// Remove Todo Function
const removeTodo = (id: number): void => {
    if (confirm('Remove this concept from your learning list?')) {
        todos = todos.filter(todo => todo.id !== id);
        
        updateStats();
        renderTodos();
        
        console.log('Removed todo:', id);
        
        // TODO: Add saveTodos() in local-storage feature
    }
};


// Start Editing Todo (basic version)
const startEditing = (id: number, currentText: string): void => {
    const newText = prompt('Edit your TypeScript concept:', currentText);
    
    if (newText && newText.trim() !== '' && newText.trim() !== currentText) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText.trim() } : todo
        );
        
        updateStats();
        renderTodos();
        
        console.log('Edited todo:', id, 'New text:', newText);
        
        // TODO: Add saveTodos() in local-storage feature
        // TODO: Enhance with inline editing in future update
    }
};

// Clear Completed Todos Function
const clearCompletedTodos = (): void => {
    if (confirm('Remove all mastered concepts?')) {
        const completedCount = todos.filter(todo => todo.completed).length;
        todos = todos.filter(todo => !todo.completed);
        
        updateStats();
        
        console.log(`Cleared ${completedCount} completed todos`);
        
        // TODO: Add saveTodos(), renderTodos() in future branches
    }
};

// Initialize Action Button Event Listeners
const initializeActionButtons = (): void => {
    const checkAllBtn = document.getElementById('check-all');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    if (checkAllBtn) {
        checkAllBtn.addEventListener('click', toggleAllTodos);
    }
    
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTodos);
    }
};


// Add Event Listeners to Todo Items
const addTodoEventListeners = (): void => {
    // Checkbox event listeners
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const todoId = parseInt((event.target as HTMLInputElement).dataset.id || '0');
            toggleTodo(todoId);
        });
    });
    
    // Edit button event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const todoId = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
            const todoText = (event.target as HTMLButtonElement).dataset.text || '';
            startEditing(todoId, todoText);
        });
    });
    
    // Remove button event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const todoId = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
            removeTodo(todoId);
        });
    });
};

// Add Event Listeners to Todo Items
const addTodoEventListeners = (): void => {
    // Checkbox event listeners
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const todoId = parseInt((event.target as HTMLInputElement).dataset.id || '0');
            toggleTodo(todoId);
        });
    });

    // Edit button event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const todoId = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
            const todoText = (event.target as HTMLButtonElement).dataset.text || '';
            startEditing(todoId, todoText);
        });
    });

    // Remove button event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const todoId = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
            removeTodo(todoId);
        });
    });
};

// Toggle Todo Completion
const toggleTodo = (id: number): void => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    updateStats();
    renderTodos();
    
    console.log('Toggled todo:', id);
    
    // TODO: Add saveTodos() in local-storage feature
};

// Render Todos Function
const renderTodos = (): void => {
    if (!todoList) {
        console.error('Todo list element not found');
        return;
    }
    
    const filteredTodos = getFilteredTodos();
    
    // Clear existing content
    todoList.innerHTML = '';
    
    // Show empty state message
    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'text-center py-8 text-light-text dark:text-dark-text';
        emptyMessage.textContent = currentFilter === 'completed' 
            ? 'No concepts mastered yet! Keep learning!' 
            : 'No concepts to show. Add some TypeScript topics to learn!';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    // Render each todo
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item p-4 rounded-lg border-2 border-light-border dark:border-[#9985FB] transition-all duration-200 ${
            todo.completed ? 'opacity-60' : ''
        }`;
        
        li.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 flex-1">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           class="todo-checkbox w-5 h-5 rounded border-2 border-light-border dark:border-[#9985FB]"
                           data-id="${todo.id}">
                    
                    <div class="flex-1">
                        <div class="flex items-center space-x-3">
                            <span class="anta-font text-lg ${todo.completed ? 'line-through opacity-60' : ''} text-light-text dark:text-dark-text">
                                ${todo.text}
                            </span>
                            
                            <div class="flex space-x-2">
                                <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-[#9985FB] text-light-text dark:text-dark-text">
                                    ${todo.category}
                                </span>
                                <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-[#9985FB] text-light-text dark:text-dark-text">
                                    ${todo.priority}
                                </span>
                                ${todo.dueDate ? `
                                    <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-[#9985FB] text-light-text dark:text-dark-text">
                                        ${new Date(todo.dueDate).toLocaleDateString()}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button class="edit-btn p-2 rounded border border-light-border dark:border-[#9985FB] hover:bg-light-border dark:hover:bg-[#9985FB] transition-colors text-light-text dark:text-dark-text"
                            data-id="${todo.id}" data-text="${todo.text}">
                        Edit
                    </button>
                    <button class="remove-btn p-2 rounded border border-light-border dark:border-[#9985FB] hover:bg-light-border dark:hover:bg-[#9985FB] transition-colors text-light-text dark:text-dark-text"
                            data-id="${todo.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
        
        todoList.appendChild(li);
    });
    
    // Add event listeners to the newly created elements
    addTodoEventListeners();
};



// Initialize Dark Mode Toggle - moved to dedicated function for consistency
const initializeDarkMode = (): void => {
    const darkModeToggle = document.getElementById('toggle-dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const lightIcon = document.querySelector('.light-icon');
            const darkIcon = document.querySelector('.dark-icon');
            if (lightIcon && darkIcon) {
                lightIcon.classList.toggle('hidden');
                darkIcon.classList.toggle('hidden');
            }
        });
    }
};

// Initialize Application
const initApp = (): void => {
    console.log('TypeScript Learning Tracker initialized');
    
    // Initialize all components
    initializeForm();
    initializeFilterButtons();
    initializeActionButtons();
    initializeDarkMode();
    
    // Initialize statistics display (only called once)
    updateStats();
    
    // Set initial filter
    filterTodos('all');
};


// Start the application
initApp();