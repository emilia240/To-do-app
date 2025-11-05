import './style.css'
import type { 
  Todo, 
  Priority,
  Category, 
  //FilterType, 
  //EditState 
} from './types'

// DOM Elements with Type Casting
const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement | null;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement | null;
//const todoList = document.querySelector('.todo-list') as HTMLUListElement | null;
const errorMessage = document.getElementById('error-message') as HTMLDivElement | null;

// State Management with Type Annotations
let todos: Todo[] = [];
//let currentFilter: FilterType = 'all';
//let editState: EditState = {
//    isEditing: false,
//    editingId: null,
//    originalText: ''
//};


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
    
    // TODO: Add saveTodos(), renderTodos(), updateStats() in future branches
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

// Initialize Application
const initApp = (): void => {
    console.log('TypeScript Learning Tracker initialized');
    
    // Initialize form handling
    initializeForm();
    
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