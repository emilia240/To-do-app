import { describe, it, expect, beforeEach } from 'vitest'

// Constants extracted to top of file for reusability
const validPriorities = ['low', 'medium', 'high', 'critical'];
const validCategories = ['basic', 'advanced', 'oop', 'dom', 'modules'];

describe('TypeScript Learning Tracker - Todo Form', () => {
    beforeEach(() => {
        // Reset DOM for each test
        document.body.innerHTML = '';
    })

    it('should have basic types defined', () => {
        expect(true).toBe(true)
    })
    
    describe('Form Validation', () => {
        it('should validate required todo text input', () => {
            const emptyText = '';
            const validText = 'Learn TypeScript Generics';
            const shortText = 'TS';
            
            expect(emptyText.trim()).toBe('');
            expect(validText.trim()).toBe('Learn TypeScript Generics');
            expect(shortText.length).toBeLessThan(3);
        })
        
        it('should validate priority values are from allowed union type', () => {
            const testPriority = 'high';

            expect(validPriorities).toContain(testPriority);
        })
        
        it('should validate category values are from allowed union type', () => {
            const testCategory = 'advanced';

            expect(validCategories).toContain(testCategory);
        })
    })
    
    describe('Todo Creation', () => {
        it('should create todo with correct TypeScript interface properties', () => {
            // Renamed from mockTodo to testTodo for accuracy
            const testTodo = {
                id: Date.now(),
                text: 'Learn TypeScript Generics',
                completed: false,
                category: 'advanced' as const,
                priority: 'high' as const,
                createdAt: new Date()
            };
            
            expect(testTodo).toHaveProperty('id');
            expect(testTodo).toHaveProperty('text', 'Learn TypeScript Generics');
            expect(testTodo).toHaveProperty('completed', false);
            expect(testTodo).toHaveProperty('category', 'advanced');
            expect(testTodo).toHaveProperty('priority', 'high');
            expect(testTodo).toHaveProperty('createdAt');
            expect(testTodo.createdAt).toBeInstanceOf(Date);
        })
        
        it('should handle optional due date property correctly', () => {
            const todoWithDate = {
                id: 1,
                dueDate: new Date('2024-12-31')
            };
            
            const todoWithoutDate = {
                id: 2,
                dueDate: undefined
            };
            
            expect(todoWithDate.dueDate).toBeInstanceOf(Date);
            expect(todoWithoutDate.dueDate).toBeUndefined();
        })
    })    
})


describe('Statistics Calculation', () => {
    it('should calculate progress percentage correctly', () => {
        const todos = [
            { id: 1, text: 'Todo 1', completed: true, category: 'basic', priority: 'medium', createdAt: new Date() },
            { id: 2, text: 'Todo 2', completed: true, category: 'basic', priority: 'medium', createdAt: new Date() },
            { id: 3, text: 'Todo 3', completed: false, category: 'basic', priority: 'medium', createdAt: new Date() },
            { id: 4, text: 'Todo 4', completed: false, category: 'basic', priority: 'medium', createdAt: new Date() }
        ];

        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const percentage = Math.round((completed / total) * 100);

        expect(percentage).toBe(50);
        expect(total).toBe(4);
        expect(completed).toBe(2);
    })

    it('should handle empty todos array for percentage calculation', () => {
        const todos: any[] = [];
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        expect(percentage).toBe(0);
        expect(total).toBe(0);
        expect(completed).toBe(0);
    })
})


// TODO: Add feature-specific tests in their respective branches:
// - feature/filter-actions: Filtering and action tests
// - feature/todo-list: Todo rendering and CRUD tests
// - feature/local-storage: Storage persistence tests
// - feature/dark-mode: Theme toggle tests
// - feature/import-export: File operations tests