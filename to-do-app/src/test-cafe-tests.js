import {Selector} from 'testcafe';

fixture (`To-Do App Tests`)
    .page(`http://localhost:5173/`);

    test('1. Add a new todo item', async t => {
    // Arrange - Set up test data and get page elements
    const todoInput = Selector('#todo-input');
    const todoList = Selector('.todo-list');
    const todoText = 'Test todo item from TestCafe';

    // Act - Perform the action of adding a todo
    await t
        .typeText(todoInput, todoText)
        .pressKey('enter');

    // Assert - Verify the todo was added successfully
    const addedTodo = todoList.find('li').withText(todoText);
    await t
        .expect(addedTodo.exists).ok('Todo item should be added to the list')
        .expect(addedTodo.find('span').textContent).eql(todoText, 'Todo text should match input');
    });

    test('2. Remove a todo item', async t => {
    // Arrange - Set up test data by first adding a todo
    const todoInput = Selector('#todo-input');
    const todoList = Selector('.todo-list');
    const todoText = 'Todo to be removed';

    // Add a todo first
    await t
        .typeText(todoInput, todoText)
        .pressKey('enter');

    // Get the added todo and its remove button
    const addedTodo = todoList.find('li').withText(todoText);
    const removeButton = addedTodo.find('button').withText('Remove');

    // Act - Remove the todo item
    await t.click(removeButton);

    // Assert - Verify the todo was removed
    await t
        .expect(addedTodo.exists).notOk('Todo item should be removed from the list')
        .expect(todoList.find('li').withText(todoText).exists).notOk('Todo should no longer exist in the list');
    });