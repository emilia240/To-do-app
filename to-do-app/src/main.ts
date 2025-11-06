import './style.css'
import type { 
  Todo, 
  Priority,
  Category, 
  FilterType, 
 // EditState 
} from './types'

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




// State Management with Type Annotations
let todos: Todo[] = [];
let currentFilter: FilterType = 'all';
/* let editState: EditState = {
    isEditing: false,
    editingId: null,
    originalText: ''
}; */



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



// Filter Todos Function
const filterTodos = (filter: FilterType): void => {
   currentFilter = filter;
    
    // Update active filter button styling
    updateFilterButtonStyling(filter);
    
    // Render todos with new filter
    renderTodos();
    
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
    renderTodos();
    saveTodos();
    
    console.log('Toggled all todos. All completed:', !allCompleted);

};


// Remove Todo Function
const removeTodo = (id: number): void => {
    if (confirm('Remove this concept from your learning list?')) {
        todos = todos.filter(todo => todo.id !== id);
        
        updateStats();
        renderTodos();
        saveTodos();
        
        console.log('Removed todo:', id);
        
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
        saveTodos();
        
        console.log('Edited todo:', id, 'New text:', newText);
        
        // TODO: Enhance with inline editing in future update
    }
};

// Clear Completed Todos Function
const clearCompletedTodos = (): void => {
    if (confirm('Remove all mastered concepts?')) {
        const completedCount = todos.filter(todo => todo.completed).length;
        todos = todos.filter(todo => !todo.completed);
        
        updateStats();
        renderTodos();
        saveTodos();
        
        console.log(`Cleared ${completedCount} completed todos`);
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


// Toggle Todo Completion
const toggleTodo = (id: number): void => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    updateStats();
    renderTodos();
    saveTodos();
    
    console.log('Toggled todo:', id);
};

// Render Todos Function

// Refactored: Break down renderTodos() into smaller, focused functions

// Create individual todo item HTML
const createTodoItemHTML = (todo: Todo): string => {
    return `
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
};

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
    li.innerHTML = createTodoItemHTML(todo);
    return li;
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
            const todoId = parseInt(target.dataset.id || '0');
            const todoText = target.dataset.text || '';
            startEditing(todoId, todoText);
        }
        
        // Handle remove button clicks
        if (target.classList.contains('remove-btn')) {
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
const saveTodos = (): void => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(todos));
        console.log('Todos saved to localStorage');
        showStorageStatus('Todos saved successfully');
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
            ? 'bg-red-500 text-white border-2 border-red-600' 
            : 'bg-green-500 text-white border-2 border-green-600'
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



// Export todos to JSON file
const exportTodos = (): void => {
    try {
        const dataToExport = {
            todos: todos,
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalCount: todos.length
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const downloadUrl = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `typescript-todos-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        URL.revokeObjectURL(downloadUrl);
        
        showStorageStatus(`📤 Exported ${todos.length} todos!`);
        console.log('Todos exported successfully');
        
    } catch (error) {
        console.error('Error exporting todos:', error);
        showStorageStatus('❌ Export failed!', true);
    }
};

// Generate CSV export
const exportTodosCSV = (): void => {
    try {
        const csvHeader = 'ID,Text,Completed,Category,Priority,Due Date,Created At\n';
        const csvRows = todos.map(todo => {
            const dueDate = todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '';
            const createdAt = todo.createdAt.toISOString().split('T')[0];
            
            return `${todo.id},"${todo.text}",${todo.completed},${todo.category},${todo.priority},"${dueDate}","${createdAt}"`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        
        const downloadUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `typescript-todos-${new Date().toISOString().split('T')[0]}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(downloadUrl);
        
        showStorageStatus(`📊 Exported ${todos.length} todos as CSV!`);
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showStorageStatus('❌ CSV export failed!', true);
    }
};


// Import todos from JSON file
const importTodos = (): void => {
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
                const importedData = JSON.parse(content);
                
                // Validate imported data structure
                if (!importedData.todos || !Array.isArray(importedData.todos)) {
                    throw new Error('Invalid file format');
                }
                
                // Process imported todos
                const importedTodos: Todo[] = importedData.todos.map((todo: any) => ({
                    id: todo.id || Date.now() + Math.random(), // Ensure unique ID
                    text: todo.text || 'Imported Todo',
                    completed: Boolean(todo.completed),
                    category: todo.category || 'basic',
                    priority: todo.priority || 'medium',
                    dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                    createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date()
                }));
                
                // Ask user how to handle import
                const choice = confirm(
                    `Import ${importedTodos.length} todos?\n\n` +
                    `Click OK to REPLACE current todos (${todos.length} items)\n` +
                    `Click Cancel to MERGE with current todos`
                );
                
                if (choice) {
                    // Replace current todos
                    todos = importedTodos;
                    showStorageStatus(`🔄 Replaced with ${importedTodos.length} todos!`);
                } else {
                    // Merge with current todos
                    const originalCount = todos.length;
                    todos = [...todos, ...importedTodos];
                    showStorageStatus(`🔗 Added ${importedTodos.length} todos! Total: ${todos.length}`);
                }
                
                // Update UI and save
                saveTodos();
                updateStats();
                renderTodos();
                
                console.log('Import successful:', importedData);
                
            } catch (error) {
                console.error('Error importing todos:', error);
                showStorageStatus('❌ Import failed! Invalid file format.', true);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// Validate imported todo structure
const validateTodoStructure = (todo: any): boolean => {
    return (
        typeof todo.id === 'number' &&
        typeof todo.text === 'string' &&
        typeof todo.completed === 'boolean' &&
        typeof todo.category === 'string' &&
        typeof todo.priority === 'string' &&
        (todo.dueDate === undefined || todo.dueDate === null || typeof todo.dueDate === 'string') &&
        (typeof todo.createdAt === 'string')
    );
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


// Show export format selection modal
const showExportDialog = (): void => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-light-card dark:bg-dark-card border-2 border-light-border dark:border-[#9985FB] rounded-lg p-6 max-w-md mx-4">
            <h3 class="anta-font text-xl mb-4 text-light-text dark:text-dark-text">Export Format</h3>
            <p class="text-light-text dark:text-dark-text mb-6">Choose your preferred export format:</p>
            
            <div class="space-y-3 mb-6">
                <button id="export-json" class="w-full p-3 rounded-lg border-2 border-light-border dark:border-[#9985FB] hover:bg-light-border dark:hover:bg-[#9985FB] transition-colors text-left">
                    <div class="font-bold">📄 JSON Format</div>
                    <div class="text-sm opacity-75">Complete data with import capability</div>
                </button>
                
                <button id="export-csv" class="w-full p-3 rounded-lg border-2 border-light-border dark:border-[#9985FB] hover:bg-light-border dark:hover:bg-[#9985FB] transition-colors text-left">
                    <div class="font-bold">📊 CSV Format</div>
                    <div class="text-sm opacity-75">Spreadsheet compatible format</div>
                </button>
            </div>
            
            <button id="cancel-export" class="w-full p-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
            </button>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('#export-json')?.addEventListener('click', () => {
        exportTodos();
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#export-csv')?.addEventListener('click', () => {
        exportTodosCSV();
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-export')?.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
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