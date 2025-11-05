import './style.css'
import type { Todo, Priority, Category, FilterType, EditState } from './types'

// DOM Elements with Type Casting
const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement | null;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement | null;
const todoList = document.querySelector('.todo-list') as HTMLUListElement | null;
const errorMessage = document.getElementById('error-message') as HTMLDivElement | null;

// State Management with Type Annotations
let todos: Todo[] = [];
let currentFilter: FilterType = 'all';
let editState: EditState = {
    isEditing: false,
    editingId: null,
    originalText: ''
};


// Get priority from radio buttons with type safety
const getSelectedPriority = (): Priority => {
    const selected = document.querySelector('input[name="priority"]:checked') as HTMLInputElement;
    return selected?.value as Priority || 'medium';
};


// Initialize Application
const initApp = (): void => {
    console.log('TypeScript Learning Tracker initialized');
    console.log('Current todos:', todos);
    console.log('Current filter:', currentFilter);
    
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