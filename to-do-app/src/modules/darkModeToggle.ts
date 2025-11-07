// Dark Mode Toggle Functionality

// Initialize Dark Mode Toggle 
export const initializeDarkMode = (): void => {
    const darkModeToggle = document.getElementById('toggle-dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const lightIcon = document.querySelector('.light-icon');
            const darkIcon = document.querySelector('.dark-icon');
            if (lightIcon && darkIcon) {
                lightIcon.classList.toggle('hidden');
                darkIcon.classList.toggle('hidden');
            }
        });
    }
};
