export const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains('darkmode');
    if (isDark) {
        document.documentElement.classList.remove('darkmode');
        localStorage.setItem('darkmode', 'inactive');
    } else {
        document.documentElement.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    }
};

export const initDarkMode = () => {
    const theme = localStorage.getItem('darkmode');
    if (theme === 'active') {
        document.documentElement.classList.add('darkmode');
    } else {
        document.documentElement.classList.remove('darkmode');
    }
};