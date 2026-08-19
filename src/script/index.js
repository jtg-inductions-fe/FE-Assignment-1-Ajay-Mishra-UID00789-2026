/* global $ */

const menu = document.querySelector('.header__menu');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__nav-overlay');
const closeBtn = document.querySelector('.header__nav-close-btn');
const accordianBtns = document.querySelectorAll('.accordian-btn');
const mobileMedia = window.matchMedia('(width <= 1024px)');

if (mobileMedia.matches) {
    nav.inert = true;
}

menu.addEventListener('click', (e) => {
    if (nav.classList.contains('open')) closeSidebar(e);
    else openSidebar(e);
});

// Event listeners
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
nav.addEventListener('keydown', trapFocus);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeSidebar(e);
    }
});

accordianBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
        toggleDisclosure.call(btn);
    }),
);

/**
 * Opens the navigation sidebar and enables the overlay.
 *
 * @param {MouseEvent} e - The click event that triggered the function.
 * @returns {void}
 */
function openSidebar(e) {
    e.stopPropagation();
    nav.classList.add('open');
    nav.inert = false;
    closeBtn.focus();
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'auto';

    document.body.style.height = '100vh';

    document.body.style.overflow = 'hidden';
}

/**
 * Closes the navigation sidebar and disables the overlay.
 *
 * @param {MouseEvent} e - The click event that triggered the function.
 * @returns {void}
 */
function closeSidebar(e) {
    e.stopPropagation();
    nav.classList.remove('open');
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';

    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';

    menu.focus();
    nav.inert = true;
}

/**
 * Controls Footer accordian
 * @returns {void}
 */
function toggleDisclosure() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    const controls = this.getAttribute('aria-controls');

    this.setAttribute('aria-expanded', !isExpanded);

    if (isExpanded) {
        document.getElementById(controls).style.display = 'none';
    } else {
        document.getElementById(controls).style.display = 'flex';
    }
}

/**
 * Traps the focus in navlist.
 *
 * @param {MouseEvent} e - The keydown event that triggered the function.
 * @returns {void}
 */
function trapFocus(e) {
    if (!mobileMedia.matches) return;
    if (!nav.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const focusable = nav.querySelectorAll(
        '.header__nav-close-btn, .header__nav-link',
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    }
}

// Slick setup
$(document).ready(function () {
    $('.testimonials__slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        prevArrow: $('.testimonials__control--prev'),
        nextArrow: $('.testimonials__control--next'),
    });
});
