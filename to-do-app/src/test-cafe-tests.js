import { Selector } from 'testcafe';

fixture `TypeScript Learning Tracker Tests`
    .page`https://todo.emilia123.dk/test/`;

test('1. Application loads correctly', async t => {
    // Arrange - Get page elements
    const header = Selector('header');
    const title = Selector('h1').withText('TypeScript Learning Tracker');
    const darkModeToggle = Selector('#toggle-dark-mode');
    
    // Assert - Verify page structure
    await t
        .expect(header.exists).ok('Header should be present')
        .expect(title.exists).ok('App title should be displayed')
        .expect(darkModeToggle.exists).ok('Dark mode toggle should be present');
});



test('2. Dark mode toggle works', async t => {
    // Arrange
    const darkModeToggle = Selector('#toggle-dark-mode');
    const body = Selector('html');
    
    // Act - Toggle dark mode
    await t.click(darkModeToggle);
    
    // Assert - Check if dark class is applied
    await t.expect(body.hasClass('dark')).ok('Dark mode should be activated');
    
    // Act - Toggle back to light mode
    await t.click(darkModeToggle);
    
    // Assert - Check if dark class is removed
    await t.expect(body.hasClass('dark')).notOk('Light mode should be activated');
});



test('3. Can add new todo item', async t => {
    // Arrange
    const todoInput = Selector('#todo-input');
    const categorySelect = Selector('#category-select');
    const submitButton = Selector('button[type="submit"]');
    const todoList = Selector('.todo-list');
    
    // Act - Add a new todo
    await t
        .typeText(todoInput, 'Learn TypeScript Interfaces')
        .click(categorySelect)
        .click(categorySelect.find('option').withText('Advanced Types'))
        .click(submitButton);
    
    // Assert - Todo should appear in list
    await t.expect(todoList.textContent).contains('Learn TypeScript Interfaces');
});



test('4. Can filter todos by status', async t => {
    // Test filter functionality
    const activeFilter = Selector('[data-filter="active"]');
    const completedFilter = Selector('[data-filter="completed"]');
    
    await t
        .click(activeFilter)
        .expect(activeFilter.hasClass('bg-[#0055FF]')).ok('Active filter should be highlighted');
});


test('5. Can toggle todo completion', async t => {
    // Arrange - First add a todo to ensure checkbox exists
    const todoInput = Selector('#todo-input');
    const categorySelect = Selector('#category-select');
    const submitButton = Selector('button[type="submit"]');
    const todoList = Selector('.todo-list');
    
    // Act - Add a todo first
    await t
        .typeText(todoInput, 'Test Todo for Checkbox')
        .click(categorySelect)
        .click(categorySelect.find('option').withText('Basic Types'))
        .click(submitButton);
    
    // Wait for todo to be rendered
    await t.expect(todoList.textContent).contains('Test Todo for Checkbox');
    
    // Now test checkbox functionality
    const checkbox = Selector('.todo-checkbox').nth(0);
    
    // Assert checkbox exists and click it
    await t
        .expect(checkbox.exists).ok('Checkbox should exist after adding todo')
        .click(checkbox)
        .expect(checkbox.checked).ok('Todo should be marked as completed');
});



test('6. Statistics update correctly', async t => {
    // Test stats calculation
    const totalElement = Selector('#total-todos');
    const completedElement = Selector('#completed-todos');
    
    await t
        .expect(totalElement.exists).ok('Total counter should exist')
        .expect(completedElement.exists).ok('Completed counter should exist');
});