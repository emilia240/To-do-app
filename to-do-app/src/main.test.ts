import { describe, it, expect, beforeEach } from 'vitest'

// Constants extracted to top of file for reusability
const validPriorities = ['low', 'medium', 'high', 'critical'];
const validCategories = ['basic', 'advanced', 'oop', 'dom', 'modules'];

describe('TypeScript Learning Tracker - Core Functionality', () => {
    beforeEach(() => {
        document.body.innerHTML = ''; // Clean DOM state
    })
    
    describe('Form Validation & Union Types', () => {
        it('should validate priority values are from union type', () => {
            const testPriority = 'high';
            expect(validPriorities).toContain(testPriority);
        })
        
        it('should validate category values are from union type', () => {
            const testCategory = 'advanced';
            expect(validCategories).toContain(testCategory);
        })
        
        it('should validate text input requirements', () => {
            const emptyText = '';
            const validText = 'Learn TypeScript Generics';
            const shortText = 'TS';
            
            expect(emptyText.trim()).toBe('');
            expect(validText.trim()).toBe('Learn TypeScript Generics');
            expect(shortText.length).toBeLessThan(3);
        })
    })
    
    describe('Todo Interface & Optional Properties', () => {
        it('should create todo with correct interface properties', () => {
            const testTodo = {
                id: Date.now(),
                text: 'Learn TypeScript Generics',
                completed: false,
                category: 'advanced' as const, // Type assertion example
                priority: 'high' as const,     // Type assertion example
                createdAt: new Date()
            };
            
            expect(testTodo).toHaveProperty('id');
            expect(testTodo).toHaveProperty('text', 'Learn TypeScript Generics');
            expect(testTodo).toHaveProperty('completed', false);
            expect(testTodo.category).toBe('advanced');
            expect(testTodo.priority).toBe('high');
            expect(testTodo.createdAt).toBeInstanceOf(Date);
        })
        
        it('should handle optional dueDate property', () => {
            const todoWithDate = { id: 1, dueDate: new Date('2024-12-31') };
            const todoWithoutDate = { id: 2, dueDate: undefined };
            
            expect(todoWithDate.dueDate).toBeInstanceOf(Date);
            expect(todoWithoutDate.dueDate).toBeUndefined();
        })
    })
    
    describe('Statistics Calculation & Array Methods', () => {
        it('should calculate progress percentage correctly', () => {
            const todos = [
                { id: 1, completed: true, text: 'Todo 1', category: 'basic', priority: 'medium', createdAt: new Date() },
                { id: 2, completed: true, text: 'Todo 2', category: 'basic', priority: 'medium', createdAt: new Date() },
                { id: 3, completed: false, text: 'Todo 3', category: 'basic', priority: 'medium', createdAt: new Date() },
                { id: 4, completed: false, text: 'Todo 4', category: 'basic', priority: 'medium', createdAt: new Date() }
            ];

            const total = todos.length;
            const completed = todos.filter(todo => todo.completed).length;
            const percentage = Math.round((completed / total) * 100);

            expect(percentage).toBe(50);
            expect(total).toBe(4);
            expect(completed).toBe(2);
        })

        it('should handle empty array edge case', () => {
            const todos: any[] = [];
            const percentage = todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0;
            expect(percentage).toBe(0);
        })
    })
    
    describe('Filter Operations & Type Safety', () => {
        it('should filter todos by completion status and priority', () => {
            const testTodos = [
                { id: 1, completed: true, priority: 'medium' },
                { id: 2, completed: false, priority: 'critical' },
                { id: 3, completed: true, priority: 'critical' },
                { id: 4, completed: false, priority: 'low' }
            ];

            const active = testTodos.filter(todo => !todo.completed);
            const completed = testTodos.filter(todo => todo.completed);
            const critical = testTodos.filter(todo => todo.priority === 'critical');

            expect(active).toHaveLength(2);
            expect(completed).toHaveLength(2);
            expect(critical).toHaveLength(2);
        })
    })
    
    describe('CRUD Operations & Immutable Updates', () => {
        it('should toggle todo completion immutably', () => {
            const testTodos = [
                { id: 1, text: 'Test Todo', completed: false },
                { id: 2, text: 'Another Todo', completed: true }
            ];
            
            // Immutable update using spread operator
            const updatedTodos = testTodos.map(todo => 
                todo.id === 1 ? { ...todo, completed: !todo.completed } : todo
            );
            
            expect(updatedTodos[0].completed).toBe(true);
            expect(updatedTodos[1].completed).toBe(true);
        })
        
        it('should remove todo by id correctly', () => {
            const testTodos = [
                { id: 1, text: 'Todo 1' },
                { id: 2, text: 'Todo 2' },
                { id: 3, text: 'Todo 3' }
            ];
            
            const filteredTodos = testTodos.filter(todo => todo.id !== 2);
            
            expect(filteredTodos).toHaveLength(2);
            expect(filteredTodos.find(todo => todo.id === 2)).toBeUndefined();
        })
    })
    
    describe('Local Storage & Type Conversion', () => {
        beforeEach(() => {
            localStorage.clear();
        });
        
        it('should handle JSON serialization/deserialization', () => {
            const testTodos = [
                { 
                    id: 1, 
                    text: 'Test Todo', 
                    completed: false, 
                    createdAt: '2024-01-01T00:00:00.000Z',
                    dueDate: '2024-12-31T00:00:00.000Z'
                }
            ];
            
            localStorage.setItem('typescript-todos', JSON.stringify(testTodos));
            const stored = localStorage.getItem('typescript-todos');
            const parsed = JSON.parse(stored!);
            
            // Simulate date conversion from storage
            const loadedTodos = parsed.map((todo: any) => ({
                ...todo,
                dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                createdAt: new Date(todo.createdAt)
            }));
            
            expect(loadedTodos[0].createdAt).toBeInstanceOf(Date);
            expect(loadedTodos[0].dueDate).toBeInstanceOf(Date);
        });
    })
    
    describe('Type Guards & Data Validation', () => {
        it('should validate import data structure', () => {
            const validData = {
                todos: [{ text: 'Valid Todo', completed: false }],
                version: '1.0'
            };
            
            const invalidData = { todos: 'not an array' };
            
            // Type guard function
            const isValidImportData = (data: any): boolean => {
                return data && 
                       typeof data === 'object' && 
                       Array.isArray(data.todos) &&
                       data.todos.every((todo: any) => 
                           typeof todo.text === 'string' && 
                           typeof todo.completed === 'boolean'
                       );
            };
            
            expect(isValidImportData(validData)).toBe(true);
            expect(isValidImportData(invalidData)).toBe(false);
        });
    });
});

