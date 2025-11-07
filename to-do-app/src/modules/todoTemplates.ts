//HTML Templates functions for Todos


import type { Todo } from './types';
import { editState } from '../main';


// Create individual todo item HTML
export const createTodoItemHTML = (todo: Todo): string => {
    return `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 flex-1">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                    class="todo-checkbox w-5 h-5 rounded border-2 border-light-border dark:border-dark-border bg-transparent"
                    data-id="${todo.id}">
                
                <div class="flex-1">
                    <div class="flex items-center space-x-3">
                        <span class="anta-font text-lg ${todo.completed ? 'line-through' : ''}">
                            ${todo.text}
                        </span>
                        
                        <div class="flex space-x-2">
                            <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-dark-border">
                                ${todo.category}
                            </span>
                            <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-dark-border ${
                                todo.priority === 'critical' ? 'bg-[#EB5092] text-white border-[#EB5092]' : ''
                            }">
                                ${todo.priority}
                            </span>
                            ${todo.dueDate ? `
                                <span class="text-xs px-2 py-1 rounded border border-light-border dark:border-dark-border">
                                    📅 ${new Date(todo.dueDate).toLocaleDateString()}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button class="edit-btn p-2 rounded border border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border transition-colors ${editState.isEditing ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-id="${todo.id}" data-text="${todo.text}">
                    ✏️
                </button>
                <button class="remove-btn p-2 rounded border border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border transition-colors ${editState.isEditing ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-id="${todo.id}">
                    🗑️
                </button>
            </div>
        </div>
    `;
};




// Create edit mode HTML
export const createEditModeHTML = (todo: Todo): string => {
    return `
        <div class="space-y-4">
            <!-- Text Input -->
            <input type="text" value="${todo.text}" 
                   class="edit-text-input w-full p-2 bg-transparent border-2 border-light-border dark:border-dark-border rounded anta-font text-lg">
            
            <!-- Category, Priority, and Date Editors -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Category Select -->
                <div>
                    <label class="block text-sm font-medium mb-1">Category</label>
                    <select class="edit-category-select w-full p-2 bg-transparent border-2 border-light-border dark:border-dark-border rounded">
                        <option value="basic" ${todo.category === 'basic' ? 'selected' : ''}>Basic Types</option>
                        <option value="advanced" ${todo.category === 'advanced' ? 'selected' : ''}>Advanced Types</option>
                        <option value="oop" ${todo.category === 'oop' ? 'selected' : ''}>OOP Concepts</option>
                        <option value="dom" ${todo.category === 'dom' ? 'selected' : ''}>DOM Manipulation</option>
                        <option value="modules" ${todo.category === 'modules' ? 'selected' : ''}>Modules</option>
                    </select>
                </div>
                
                <!-- Priority Select -->
                <div>
                    <label class="block text-sm font-medium mb-1">Priority</label>
                    <select class="edit-priority-select w-full p-2 bg-transparent border-2 border-light-border dark:border-dark-border rounded">
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="critical" ${todo.priority === 'critical' ? 'selected' : ''}>Critical</option>
                    </select>
                </div>
                
                <!-- Due Date Input -->
                <div>
                    <label class="block text-sm font-medium mb-1">Due Date</label>
                    <input type="date" value="${todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''}"
                           class="edit-date-input w-full p-2 bg-transparent border-2 border-light-border dark:border-dark-border rounded">
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2">
                <button class="save-edit text-sm px-4 py-2 rounded border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-colors">
                    💾 Save Changes
                </button>
                <button class="cancel-edit text-sm px-4 py-2 rounded border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white transition-colors">
                    ❌ Cancel
                </button>
            </div>
        </div>
    `;
};


