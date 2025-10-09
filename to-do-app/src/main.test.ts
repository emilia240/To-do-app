import {describe, it, expect } from "vitest";

//unit testing

//there is a refactored version of this file in which we should import the functions from main.ts
//we manually had to rewrite  the Todo interface, the addTodo, and the removeTodo functions here because we are not importing it from main.ts
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}


//testing the functionality of addTodo and removeTodo functions
const addTodo = (todos: Todo[], text: string) => {
    const newTodo: Todo = {
        id: 123,
        text: text,
        completed: false
    };
    return [...todos, newTodo]; //when testing it's better to return a new array instead of mutating the original; 
}

const removeTodo = (todos: Todo[], id:number) => {
    return todos.filter(todo => todo.id !== id);
}

//test-driven development (TDD) approach: if we were to write the functions first, we might miss some edge cases or important details that the tests would have highlighted.

describe('To-Do App', () => {
    it('should add a new todo', () => {
       const todos: Todo[] = []; //will only work inside the it block; if I want to use it elsewhere, I need to declare it outside
       const result= addTodo(todos, 'Test todo');
       expect(result.length).toBe(1);//checking if the length of the result array is 1
       expect(result[0].text).toBe('Test todo');//checking if the text property of the first item in the result array is 'Test todo'
        expect(result[0].completed).toBe(false);//checking if the completed property of the first item in the result array is false
    })

})

describe('removeTodo', () => {
    it('should remove a todo', () => {
        const todos: Todo[] = [{
            id: 123,
            text: 'Test todo',
            completed: false
        },
        {id: 456,
        text: 'Another todo',
        completed: false
        }];
        const result = removeTodo(todos, 123); //removing the todo with id 123
        expect(result.length).toBe(1); //checking if the length of the result array is 1
        expect(result[0].id).toBe(456); //checking if the id of the first item in the result array is 456
        
    })

    it('should do notghing if the id does not exist', () => {
        const todos: Todo[] = [
            { id: 123, text: 'Test todo', completed: false },
            { id: 456, text: 'Another todo', completed: false }
        ];
        const result = removeTodo(todos, 999);

        expect(result.length).toBe(2); //checking if the length of the result array is 2
        expect(result[0].id).toBe(123); //checking if the id of the first item in the result array is 123; if it still exists
        expect(result[1].id).toBe(456); //checking if the id of the second item in the result array is 456
    })
})