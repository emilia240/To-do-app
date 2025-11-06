import './style.css'
import type { 
  Todo, 
  Priority,
  Category, 
  FilterType, 
  //EditState 
} from './types'

// DOM Elements with Type Casting
const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement | null;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement | null;
//const todoList = document.querySelector('.todo-list') as HTMLUListElement | null;
const errorMessage = document.getElementById('error-message') as HTMLDivElement | null;


// Statistics DOM elements - defined once as top-level constants
const totalTodosElement = document.getElementById('total-todos') as HTMLDivElement | null;
const completedTodosElement = document.getElementById('completed-todos') as HTMLDivElement | null;
const progressPercentElement = document.getElementById('progress-percent') as HTMLDivElement | null;




// State Management with Type Annotations
let todos: Todo[] = [];
let currentFilter: FilterType = 'all';
//let editState: EditState = {
//    isEditing: false,
//    editingId: null,
//    originalText: ''
//};



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
    currentFilter = filter;
    // TODO: Add renderTodos() call in next feature branch
    
    // Update active filter button styling
    updateFilterButtonStyling(filter);
    
    console.log('Filter changed to:', filter);
};


// Update Filter Button Styling
const updateFilterButtonStyling = (activeFilter: FilterType): void => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter') as FilterType;
        const isActive = btnFilter === activeFilter;
        
        // Remove all existing background classes
        btn.classList.remove('bg-[#9985FB]', 'bg-[#0055FF]', 'bg-[#0F7D00]', 'bg-[#F296BD]');
        
        // Apply active styling based on filter type
        if (isActive) {
            switch (btnFilter) {
                case 'all':
                    btn.classList.add('bg-[#9985FB]');
                    break;
                case 'active':
                    btn.classList.add('bg-[#0055FF]');
                    break;
                case 'completed':
                    btn.classList.add('bg-[#0F7D00]');
                    break;
                case 'critical':
                    btn.classList.add('bg-[#F296BD]');
                    break;
            }
        }
    });
};


// Get Filtered Todos Function
const getFilteredTodos = (): Todo[] => {
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
};

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


// Initialize Application
const initApp = (): void => {
    console.log('TypeScript Learning Tracker initialized');
    
    // Initialize form handling
    initializeForm();

    // Initialize statistics display
    updateStats();
    
    // Basic dark mode toggle (will be enhanced in feature/dark-mode)
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


// Start the application
initApp();