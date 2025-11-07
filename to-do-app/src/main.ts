import './style.css'
import type { 
  Todo, 
  Priority,
  Category, 
  FilterType, 
  EditState,
  TodoStats, 
  ImportData
} from './modules/types'

import { initializeDarkMode } from './modules/darkModeToggle'

import { createTodoItemHTML, createEditModeHTML } from './modules/todoTemplates';

// Constants
const storageKey = 'typescript-todos';

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




// State Management with Type Annotations for filters and edit state
let todos: Todo[] = [];
let currentFilter: FilterType = 'all';
let editState: EditState = {
    isEditing: false,
    editingId: null,
    originalText: ''
};

export { editState }; //for the HTML templates module





// Utility Functions 


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


// Type guard function for validating import data structure
const validateImportData = (data: any): data is ImportData => {
    return (
        data &&
        typeof data === 'object' &&
        Array.isArray(data.todos) &&
        data.todos.every((todo: any) => 
            todo &&
            typeof todo === 'object' &&
            typeof todo.text === 'string' &&
            typeof todo.completed === 'boolean' &&
            (todo.category === undefined || typeof todo.category === 'string') &&
            (todo.priority === undefined || typeof todo.priority === 'string')
        )
    );
};





// Local Storage Functions

// Load todos from localStorage
const loadTodos = (): Todo[] => {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            const loadedTodos = parsed.map((todo: any) => ({
                ...todo,
                dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                createdAt: new Date(todo.createdAt)
            }));
            showStorageStatus(`📂 Loaded ${loadedTodos.length} todos`);
            return loadedTodos;
        }
    } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        showStorageStatus('❌ Load failed!', true);
    }
    return [];
};


// Save todos to localStorage
const saveTodos = (message?: string): void => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(todos));
        console.log('Todos saved to localStorage');
        if (message) {
            showStorageStatus(message);
        } else {
            showStorageStatus('Todos saved successfully');
        }
    } catch (error) {
        console.error('Error saving todos to localStorage:', error);
        showStorageStatus('Error saving todos', true);
    }
};


// Add storage status indicator
const showStorageStatus = (message: string, isError: boolean = false): void => {
    // Create or get existing status element
    let statusElement = document.getElementById('storage-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'storage-status';
        statusElement.className = 'fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform translate-y-full opacity-0';
        document.body.appendChild(statusElement);
    }
    
    // Update content and styling
    statusElement.textContent = message;
    statusElement.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isError 
            ? 'bg-red-700 text-white border-2 border-red-600' 
            : 'bg-green-700 text-white border-2 border-green-600'
    }`;
    
    // Show the status
    setTimeout(() => {
        statusElement!.style.transform = 'translateY(0)';
        statusElement!.style.opacity = '1';
    }, 100);
    
    // Hide after 2 seconds
    setTimeout(() => {
        statusElement!.style.transform = 'translateY(100%)';
        statusElement!.style.opacity = '0';
    }, 2000);
};






// Form handling and validation

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
    
    updateStats();
    renderTodos();
    saveTodos();
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







//Filtering and Displaying logic for Todos



// Filter Todos Function
const filterTodos = (filter: FilterType): void => {
    currentFilter = filter;
    
    // Update active filter button styling with color-coded approach
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter');
        const isActive = btnFilter === filter;
        
        // Remove all existing classes
        btn.classList.remove(
            'bg-[#9985FB]', 'text-dark-bg',
            'bg-[#0055FF]', 'text-white',
            'bg-[#0F7D00]', 'text-white',
            'bg-[#EB5092]', 'text-white',
            'border-[#9985FB]', 'border-[#0055FF]', 'border-[#0F7D00]', 'border-[#EB5092]',
            'text-[#9985FB]', 'text-[#0055FF]', 'text-[#0F7D00]', 'text-[#EB5092]',
            'text-[#020513]', 'hover:text-[#9985FB]', 'hover:text-[#0055FF]', 'hover:text-[#0F7D00]', 'hover:text-[#EB5092]',
            'hover:bg-[#9985FB]', 'hover:bg-[#0055FF]', 'hover:bg-[#0F7D00]', 'hover:bg-[#EB5092]',
            'border-light-border', 'bg-light-border', 'text-light-bg'
        );
        
        // Apply colors based on filter type
        switch (btnFilter) {
            case 'all':
                btn.classList.add('border-[#9985FB]', 'text-[#020513]');
                if (isActive) {
                    btn.classList.add('bg-[#9985FB]');
                } else {
                    btn.classList.add('hover:bg-[#9985FB]');
                }
                break;
            case 'active':
                btn.classList.add('border-[#0055FF]', 'text-[#020513]');
                if (isActive) {
                    btn.classList.add('bg-[#0055FF]');
                } else {
                    btn.classList.add('hover:bg-[#0055FF]');
                }
                break;
            case 'completed':
                btn.classList.add('border-[#0F7D00]', 'text-[#020513]');
                if (isActive) {
                    btn.classList.add('bg-[#0F7D00]');
                } else {
                    btn.classList.add('hover:bg-[#0F7D00]');
                }
                break;
            case 'critical':
                btn.classList.add('border-[#EB5092]', 'text-[#020513]');
                if (isActive) {
                    btn.classList.add('bg-[#EB5092]');
                } else {
                    btn.classList.add('hover:bg-[#EB5092]');
                }
                break;
        }
    });
    
    // Render todos with new filter
    renderTodos();
    
    console.log('Filter changed to:', filter);
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





// Todo CRUD Operations


// Toggle Todo Completion
const toggleTodo = (id: number): void => {
    if (editState.isEditing) return;
    
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    updateStats();
    renderTodos();
    saveTodos();
    
    console.log('Toggled todo:', id);
};


// Toggle All Todos Function
const toggleAllTodos = (): void => {
    if (editState.isEditing) return;

    const allCompleted = todos.every(todo => todo.completed);
    todos = todos.map(todo => ({
        ...todo,
        completed: !allCompleted
    }));
    
    updateStats();
    renderTodos();
    saveTodos();
    
    console.log('Toggled all todos. All completed:', !allCompleted);

};


// Remove Todo Function
const removeTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos('🗑️ Todo removed successfully');
    renderTodos();
    updateStats();
};


// Clear Completed Todos Function
const clearCompletedTodos = (): void => {
    if (editState.isEditing) return;

    
    const completedCount = todos.filter(todo => todo.completed).length;
    todos = todos.filter(todo => !todo.completed);
    
    updateStats();
    renderTodos();
    saveTodos();
    
    console.log(`Cleared ${completedCount} completed todos`);

};





// Editing Functionality


// Start Editing Todo Function
const startEditing = (id: number, currentText: string): void => {
    editState = {
        isEditing: true,
        editingId: id,
        originalText: currentText
    };
    renderTodos();
};


// Save Edited Todo
const saveEdit = (id: number, newText: string, newCategory?: Category, newPriority?: Priority, newDueDate?: Date | null): void => {
    if (newText.trim() === '') {
        cancelEdit();
        return;
    }
    
    todos = todos.map(todo => 
        todo.id === id ? { 
            ...todo, 
            text: newText.trim(),
            category: newCategory || todo.category,
            priority: newPriority || todo.priority,
            dueDate: newDueDate !== undefined ? (newDueDate || undefined) : todo.dueDate
        } : todo
    );
    saveTodos();
    editState = { isEditing: false, editingId: null, originalText: '' };
    renderTodos();
    updateStats();
};



// Cancel Editing Todo
const cancelEdit = (): void => {
    editState = { isEditing: false, editingId: null, originalText: '' };
    renderTodos();
};






// Rendering and DOM Manipulation

//using templates functions imported from todoTemplates module


// Create empty state message
const createEmptyStateMessage = (): HTMLLIElement => {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'text-center py-8 text-light-text dark:text-dark-text';
    emptyMessage.textContent = currentFilter === 'completed' 
        ? 'No concepts mastered yet! Keep learning!' 
        : 'No concepts to show. Add some TypeScript topics to learn!';
    return emptyMessage;
};


// Create individual todo list item element
const createTodoElement = (todo: Todo): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = `todo-item p-4 rounded-lg border-2 border-light-border dark:border-[#9985FB] transition-all duration-200 ${
        todo.completed ? 'opacity-60' : ''
    }`;
    
    const isEditing = editState.isEditing && editState.editingId === todo.id;
    
    if (isEditing) {
        li.innerHTML = createEditModeHTML(todo);
        setupEditModeEventListeners(li, todo);
    } else {
        li.innerHTML = createTodoItemHTML(todo);
    }
    
    return li;
};


// Setup event listeners for edit mode
const setupEditModeEventListeners = (li: HTMLLIElement, todo: Todo): void => {
    const saveBtn = li.querySelector('.save-edit') as HTMLButtonElement;
    const cancelBtn = li.querySelector('.cancel-edit') as HTMLButtonElement;
    const textInput = li.querySelector('.edit-text-input') as HTMLInputElement;
    const categorySelect = li.querySelector('.edit-category-select') as HTMLSelectElement;
    const prioritySelect = li.querySelector('.edit-priority-select') as HTMLSelectElement;
    const dateInput = li.querySelector('.edit-date-input') as HTMLInputElement;
    
    const handleSave = () => {
        const newText = textInput.value;
        const newCategory = categorySelect.value as Category;
        const newPriority = prioritySelect.value as Priority;
        const newDueDate = dateInput.value ? new Date(dateInput.value) : null;
        
        saveEdit(todo.id, newText, newCategory, newPriority, newDueDate);
    };
    
    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', cancelEdit);
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSave();
    });
    textInput.focus();
};



// Refactored: Simplified renderTodos() function - now focused only on DOM manipulation
const renderTodos = (): void => {
    if (!todoList) {
        console.error('Todo list element not found');
        return;
    }
    
    const filteredTodos = getFilteredTodos();
    
    // Clear existing content
    todoList.innerHTML = '';
    
    // Handle empty state
    if (filteredTodos.length === 0) {
        todoList.appendChild(createEmptyStateMessage());
        return;
    }
    
    // Render each todo using focused helper function
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
};







// Event Listeners Delegation


// Refactored: Use event delegation instead of multiple event listeners
const initializeTodoListEventDelegation = (): void => {
    if (!todoList) {
        console.error('Todo list element not found for event delegation');
        return;
    }

    // Single event listener on parent element using event delegation
    todoList.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        
        // Handle edit button clicks
        if (target.classList.contains('edit-btn')) {
            if (editState.isEditing) return; // Prevent multiple edits
            const todoId = parseInt(target.dataset.id || '0');
            const todoText = target.dataset.text || '';
            startEditing(todoId, todoText);
        }
        
        // Handle remove button clicks
        if (target.classList.contains('remove-btn')) {
            if (editState.isEditing) return; // Prevent removal while editing
            const todoId = parseInt(target.dataset.id || '0');
            removeTodo(todoId);
        }
    });

    // Separate event listener for checkbox changes (using delegation)
    todoList.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        
        if (target.classList.contains('todo-checkbox')) {
            const todoId = parseInt(target.dataset.id || '0');
            toggleTodo(todoId);
        }
    });
};






// Import/Export Functionality


// Export todos to JSON file
const exportTodos = (): void => {
    try {
        const exportData: ImportData = {
            todos: todos,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `typescript-todos-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        showStorageStatus(`📤 Exported ${todos.length} todos!`);
        console.log('Todos exported successfully');
        
    } catch (error) {
        console.error('Error exporting todos:', error);
        showStorageStatus('❌ Export failed!', true);
    }
};



// Import todos from JSON file
const importTodos = (): void => {
    if (editState.isEditing) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const rawData = JSON.parse(content);


                // Use type guard for robust validation
                if (!validateImportData(rawData)) {
                    throw new Error('Invalid file format: Expected todos array with valid structure');
                }
                
                // Now we have type-safe access to ImportData
                const importData: ImportData = rawData;
                


                // Process imported todos
                const importedTodos: Todo[] = importData.todos.map((todo: any) => ({
                    id: todo.id || Date.now() + Math.random(),
                    text: todo.text || 'Imported Todo',
                    completed: Boolean(todo.completed),
                    category: todo.category || 'basic',
                    priority: todo.priority || 'medium',
                    dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                    createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date()
                }));
                
                // Store original count for logging
                const originalCount = todos.length;
                
                // Ask user how to handle import
                const choice = confirm(
                    `Import ${importedTodos.length} todos?\n\n` +
                    `Click OK to REPLACE current todos (${originalCount} items)\n` +
                    `Click Cancel to MERGE with current todos`
                );
                
                if (choice) {
                    // Replace current todos
                    todos = importedTodos;
                    showStorageStatus(`🔄 Replaced ${originalCount} todos with ${importedTodos.length} todos!`);
                } else {
                    // Merge with current todos
                    todos = [...todos, ...importedTodos];
                    showStorageStatus(`🔗 Added ${importedTodos.length} todos to existing ${originalCount}! Total: ${todos.length}`);
                }
                
                // Update UI and save
                saveTodos();
                updateStats();
                renderTodos();
                
                console.log(`Import successful: Original: ${originalCount}, Imported: ${importedTodos.length}, Total: ${todos.length}`);
                
            } catch (error) {
                console.error('Error importing todos:', error);
                showStorageStatus('❌ Import failed! Invalid file format.', true);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};



// Initialize Import/Export Button Event Listeners
const initializeImportExportButtons = (): void => {
    const exportBtn = document.getElementById('export-todos');
    const importBtn = document.getElementById('import-todos');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (todos.length === 0) {
                showStorageStatus('❌ No todos to export!', true);
                return;
            }
            exportTodos();
        });
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', importTodos);
    }
};





//Action Buttons



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
    
    // Load existing todos from localStorage
    todos = loadTodos();
    console.log('Loaded', todos.length, 'todos from localStorage');


    // Initialize all components
    initializeForm();
    initializeFilterButtons();
    initializeActionButtons();
    initializeImportExportButtons();
    initializeDarkMode();
    initializeTodoListEventDelegation();
    
    
    // Initialize statistics display (only called once)
    updateStats();

    // Initial render of todos
    renderTodos();
    
    // Set initial filter
    filterTodos('all');
};


// Start the application
initApp();