import './style.css'

//counter left for when/if I use modules


//the feature list to be released on w43

interface ToDo {
  id: number;
  text: string;
  completed: boolean;
}


let todos: ToDo[] = [];

const todoInput =document.getElementById('todo-input') as HTMLInputElement;
const todoForm =document.querySelector('.todo-form') as HTMLFormElement;
const todoList =document.querySelector('.todo-list') as HTMLUListElement;

const addTodo = (text: string) =>{
  const newTodo: ToDo = {
    id: Date.now(), 
    text: text,
    completed: false
  }
  todos.push(newTodo); //if we need to do testing, we should return a new array instead of mutating the original
  console.log('check to see if push works:', todos)
  renderTodos();
}

//the export version of addTodo for testing purposes woul look like this
// export const addTodo = (todos: ToDo[], text: string) =>{
//   const newTodo: ToDo = {
//     id: Date.now(), 
//     text: text,
//     completed: false
//   }
//   return [...todos, newTodo]; 
// }

//addTodo(todoInput.value)

//Date.now() generates a unique ID based on the current timestamp; for testing purposes; not in-real-life application
// todos.push(newTodo) adds the new to-do item to the todos array;

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  // Prevents the default form submission behavior; stops reloading of page
  const text = todoInput.value.trim(); //Retrieves and trims the input value
  if (text !== '') {
    addTodo(text);
    todoInput.value = ''; // Clears the input field after adding the to-do item
  }
})

const renderTodos = () => {
  todoList.innerHTML = ''; // Clear existing list
  todos.forEach((todo)=> {
    const li = document.createElement('li'); //store each to-do item in a list item element
    li.className = 'todo-item';
    li.innerHTML =`<span>${todo.text}</span> 
    <button>Remove</button>` //attached class and text to each li


    addRemoveButtonListener(li, todo.id);
    todoList.appendChild(li);
  })
}

renderTodos();

const addRemoveButtonListener = (li: HTMLLIElement, id: number) => {
  const removeButton = li.querySelector('button') as HTMLButtonElement;
  removeButton?.addEventListener('click', () => {
    removeTodo(id);
  }) //we added ? to make sure removeButton exists before adding the event listener; optional chaining
}

const removeTodo = (id: number) => {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}


//Quiz

//difference between types and interface: types can be used for any type, not just objects; interfaces can be extended, types cannot; interfaces can be merged, types cannot
//types could only be used for objects; interfaces can be used for objects and classes
// let unionType: (string | number)[] = ["123", 456] we have to use parantheses to group the union type when using it in an array


