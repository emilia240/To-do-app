// Union Types - Restricts values to specific options
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Category = 'basic' | 'advanced' | 'oop' | 'dom' | 'modules';
export type FilterType = 'all' | 'active' | 'completed' | 'critical';

// Main Interface with Optional Properties
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    category: Category;
    priority: Priority;
    dueDate?: Date;  // Optional property - can be undefined
    createdAt: Date;
}

// Interface for editing state management
export interface EditState {
    isEditing: boolean;
    editingId: number | null;
    originalText: string;
}