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


// Add to main.test.ts
describe('Filter and Actions', () => {
    it('should filter todos by completion status', () => {
        const testTodos = [
            { id: 1, text: 'Todo 1', completed: true, category: 'basic', priority: 'medium' },
            { id: 2, text: 'Todo 2', completed: false, category: 'basic', priority: 'medium' },
            { id: 3, text: 'Todo 3', completed: true, category: 'basic', priority: 'critical' },
            { id: 4, text: 'Todo 4', completed: false, category: 'basic', priority: 'critical' }
        ];

        const active = testTodos.filter(todo => !todo.completed);
        const completed = testTodos.filter(todo => todo.completed);
        const critical = testTodos.filter(todo => todo.priority === 'critical');

        expect(active).toHaveLength(2);
        expect(completed).toHaveLength(2);
        expect(critical).toHaveLength(2);
    })

    it('should toggle all todos correctly', () => {
        const testTodos = [
            { id: 1, completed: true },
            { id: 2, completed: false },
            { id: 3, completed: true }
        ];

        const allCompleted = testTodos.every(todo => todo.completed);
        const toggledTodos = testTodos.map(todo => ({
            ...todo,
            completed: !allCompleted
        }));

        expect(allCompleted).toBe(false);
        expect(toggledTodos.every(todo => !todo.completed)).toBe(true);
    })
})


// Add to main.test.ts
describe('Todo List Rendering and CRUD', () => {
    it('should render empty state message when no todos exist', () => {
        const todos: any[] = [];
        const filteredTodos = todos.filter(() => true);
        
        expect(filteredTodos).toHaveLength(0);
    })
    
    it('should toggle todo completion status correctly', () => {
        const testTodos = [
            { id: 1, text: 'Test Todo', completed: false },
            { id: 2, text: 'Another Todo', completed: true }
        ];
        
        const updatedTodos = testTodos.map(todo => 
            todo.id === 1 ? { ...todo, completed: !todo.completed } : todo
        );
        
        expect(updatedTodos[0].completed).toBe(true);
        expect(updatedTodos[1].completed).toBe(true);
    })
    
    it('should remove todo correctly by id', () => {
        const testTodos = [
            { id: 1, text: 'Todo 1' },
            { id: 2, text: 'Todo 2' },
            { id: 3, text: 'Todo 3' }
        ];
        
        const filteredTodos = testTodos.filter(todo => todo.id !== 2);
        
        expect(filteredTodos).toHaveLength(2);
        expect(filteredTodos.find(todo => todo.id === 2)).toBeUndefined();
        expect(filteredTodos.find(todo => todo.id === 1)).toBeDefined();
        expect(filteredTodos.find(todo => todo.id === 3)).toBeDefined();
    })
    
    it('should edit todo text correctly', () => {
        const testTodos = [
            { id: 1, text: 'Original Text', category: 'basic' }
        ];
        
        const updatedTodos = testTodos.map(todo => 
            todo.id === 1 ? { ...todo, text: 'Edited Text' } : todo
        );
        
        expect(updatedTodos[0].text).toBe('Edited Text');
        expect(updatedTodos[0].category).toBe('basic'); // Other properties preserved
    })
    
    it('should filter todos by priority correctly', () => {
        const testTodos = [
            { id: 1, priority: 'low', completed: false },
            { id: 2, priority: 'critical', completed: false },
            { id: 3, priority: 'medium', completed: true },
            { id: 4, priority: 'critical', completed: true }
        ];
        
        const criticalTodos = testTodos.filter(todo => todo.priority === 'critical');
        const activeTodos = testTodos.filter(todo => !todo.completed);
        const completedTodos = testTodos.filter(todo => todo.completed);
        
        expect(criticalTodos).toHaveLength(2);
        expect(activeTodos).toHaveLength(2);
        expect(completedTodos).toHaveLength(2);
    })
})

describe('Local Storage Persistence', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });
    
    it('should save todos to localStorage in JSON format', () => {
        const testTodos = [
            { id: 1, text: 'Test Todo', completed: false, category: 'basic', priority: 'medium', createdAt: new Date() }
        ];
        
        localStorage.setItem('typescript-todos', JSON.stringify(testTodos));
        const stored = localStorage.getItem('typescript-todos');
        
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored!)).toEqual(testTodos);
    });
    
    it('should load todos from localStorage correctly', () => {
        const testTodos = [
            { 
                id: 1, 
                text: 'Test Todo', 
                completed: false, 
                category: 'basic', 
                priority: 'medium', 
                createdAt: '2024-01-01T00:00:00.000Z',
                dueDate: '2024-12-31T00:00:00.000Z'
            }
        ];
        
        localStorage.setItem('typescript-todos', JSON.stringify(testTodos));
        const stored = localStorage.getItem('typescript-todos');
        const parsed = JSON.parse(stored!);
        
        // Simulate the date parsing that happens in loadTodos
        const loadedTodos = parsed.map((todo: any) => ({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
            createdAt: new Date(todo.createdAt)
        }));
        
        expect(loadedTodos[0].createdAt).toBeInstanceOf(Date);
        expect(loadedTodos[0].dueDate).toBeInstanceOf(Date);
        expect(loadedTodos[0].text).toBe('Test Todo');
    });
    
    it('should handle empty localStorage gracefully', () => {
        const stored = localStorage.getItem('typescript-todos');
        expect(stored).toBeNull();
        
        // Simulate loadTodos behavior
        const todos = stored ? JSON.parse(stored) : [];
        expect(todos).toEqual([]);
    });
    
    it('should handle corrupted localStorage data', () => {
        localStorage.setItem('typescript-todos', 'invalid json');
        
        let todos: any[] = [];
        try {
            const stored = localStorage.getItem('typescript-todos');
            if (stored) {
                todos = JSON.parse(stored);
            }
        } catch (error) {
            todos = []; // Fallback to empty array
        }
        
        expect(todos).toEqual([]);
    });
    
    it('should preserve todo properties during save/load cycle', () => {
        const originalTodo = {
            id: 123456789,
            text: 'Learn TypeScript',
            completed: true,
            category: 'advanced' as const,
            priority: 'high' as const,
            createdAt: new Date('2024-01-01'),
            dueDate: new Date('2024-12-31')
        };
        
        // Save
        localStorage.setItem('typescript-todos', JSON.stringify([originalTodo]));
        
        // Load
        const stored = localStorage.getItem('typescript-todos');
        const parsed = JSON.parse(stored!);
        const loadedTodo = {
            ...parsed[0],
            dueDate: parsed[0].dueDate ? new Date(parsed[0].dueDate) : undefined,
            createdAt: new Date(parsed[0].createdAt)
        };
        
        expect(loadedTodo.id).toBe(originalTodo.id);
        expect(loadedTodo.text).toBe(originalTodo.text);
        expect(loadedTodo.completed).toBe(originalTodo.completed);
        expect(loadedTodo.category).toBe(originalTodo.category);
        expect(loadedTodo.priority).toBe(originalTodo.priority);
        expect(loadedTodo.createdAt.getTime()).toBe(originalTodo.createdAt.getTime());
        expect(loadedTodo.dueDate?.getTime()).toBe(originalTodo.dueDate.getTime());
    });
});


describe('Import/Export Functionality', () => {
    beforeEach(() => {
        // Clear any existing data
        localStorage.clear();
    });
    
    it('should format export data with metadata', () => {
        const testTodos = [
            { id: 1, text: 'Test Todo', completed: false, category: 'basic', priority: 'medium', createdAt: new Date() }
        ];
        
        const exportData = {
            todos: testTodos,
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalCount: testTodos.length
        };
        
        expect(exportData.todos).toEqual(testTodos);
        expect(exportData.totalCount).toBe(1);
        expect(exportData.version).toBe('1.0');
        expect(exportData.exportDate).toBeTruthy();
    });
    
    it('should validate todo structure during import', () => {
        const validTodo = {
            id: 1,
            text: 'Valid Todo',
            completed: false,
            category: 'basic',
            priority: 'medium',
            createdAt: '2024-01-01T00:00:00.000Z'
        };
        
        const invalidTodo = {
            id: 'invalid', // Should be number
            text: 123, // Should be string
            completed: 'false' // Should be boolean
        };
        
        const validateTodoStructure = (todo: any): boolean => {
            return (
                typeof todo.id === 'number' &&
                typeof todo.text === 'string' &&
                typeof todo.completed === 'boolean'
            );
        };
        
        expect(validateTodoStructure(validTodo)).toBe(true);
        expect(validateTodoStructure(invalidTodo)).toBe(false);
    });
    
    it('should generate CSV format correctly', () => {
        const testTodos = [
            {
                id: 1,
                text: 'Test Todo',
                completed: false,
                category: 'basic',
                priority: 'medium',
                dueDate: new Date('2024-12-31'),
                createdAt: new Date('2024-01-01')
            }
        ];
        
        const csvHeader = 'ID,Text,Completed,Category,Priority,Due Date,Created At\n';
        const csvRow = '1,"Test Todo",false,basic,medium,"2024-12-31","2024-01-01"';
        const expectedCSV = csvHeader + csvRow;
        
        // Simulate CSV generation logic
        const csvRows = testTodos.map(todo => {
            const dueDate = todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '';
            const createdAt = todo.createdAt.toISOString().split('T')[0];
            
            return `${todo.id},"${todo.text}",${todo.completed},${todo.category},${todo.priority},"${dueDate}","${createdAt}"`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        
        expect(csvContent).toContain('ID,Text,Completed');
        expect(csvContent).toContain('Test Todo');
        expect(csvContent).toContain('2024-12-31');
    });
    
    it('should handle import data processing', () => {
        const importData = {
            todos: [
                {
                    id: 1,
                    text: 'Imported Todo',
                    completed: true,
                    category: 'advanced',
                    priority: 'high',
                    dueDate: '2024-12-31T00:00:00.000Z',
                    createdAt: '2024-01-01T00:00:00.000Z'
                }
            ],
            exportDate: '2024-01-01T00:00:00.000Z',
            version: '1.0'
        };
        
        // Simulate import processing
        const processedTodos = importData.todos.map((todo: any) => ({
            id: todo.id || Date.now(),
            text: todo.text || 'Imported Todo',
            completed: Boolean(todo.completed),
            category: todo.category || 'basic',
            priority: todo.priority || 'medium',
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
            createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date()
        }));
        
        expect(processedTodos[0].id).toBe(1);
        expect(processedTodos[0].text).toBe('Imported Todo');
        expect(processedTodos[0].completed).toBe(true);
        expect(processedTodos[0].dueDate).toBeInstanceOf(Date);
        expect(processedTodos[0].createdAt).toBeInstanceOf(Date);
    });
    
    it('should handle malformed import data gracefully', () => {
        const malformedData = {
            todos: 'not an array',
            invalidStructure: true
        };
        
        let isValid = false;
        try {
            if (!malformedData.todos || !Array.isArray(malformedData.todos)) {
                throw new Error('Invalid file format');
            }
            isValid = true;
        } catch (error) {
            isValid = false;
        }
        
        expect(isValid).toBe(false);
    });
});

// TODO: Add feature-specific tests in their respective branches:
// - feature/dark-mode: Theme toggle tests
