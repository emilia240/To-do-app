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

// More tests will be added as features are implemented