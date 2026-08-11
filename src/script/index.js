const menu = document.querySelector('.header__menu');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__nav-overlay');
const closeBtn = document.querySelector('.header__nav-close-btn');

menu.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
    } else {
        nav.classList.add('open');
        overlay.style.visibility = 'visible';
        overlay.style.pointerEvents = 'auto';
    }
});

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.remove('open');
    overlay.style.visibility = 'hidden';
});

overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.remove('open');
    overlay.style.visibility = 'hidden';
});
