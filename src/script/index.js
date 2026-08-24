/* global $ */

const menu = document.querySelector('.header__menu');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__nav-overlay');
const closeBtn = document.querySelector('.header__nav-close-btn');
const accordianBtns = document.querySelectorAll('.accordian-btn');
const mobileMedia = window.matchMedia('(width <= 1024px)');
const footerLinks = document.querySelectorAll('.footer__navigation ul');

if (mobileMedia.matches) {
    nav.inert = true;
    hideFooterLinks();
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

window.addEventListener('resize', () => {
    debounce(showFooterLinks, 300)();
    debounce(handleNavInertNess, 300)();
});

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

    menu.setAttribute('aria-expanded', 'true');

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

    menu.setAttribute('aria-expanded', 'false');

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
        document.getElementById(controls).classList.add('hidden');
    } else {
        document.getElementById(controls).classList.remove('hidden');
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

/**
 * hides footer links
 * @returns {void}
 */
function hideFooterLinks() {
    const media = window.matchMedia('(width < 441px)');
    if (media.matches) {
        footerLinks.forEach((el) => el.classList.add('hidden'));
    }
}

/**
 * makes footer links visible on resizing window
 * @returns {void}
 */
function showFooterLinks() {
    const media = window.matchMedia('(width > 440px)');
    if (media.matches) {
        footerLinks.forEach((el) => el.classList.remove('hidden'));
    } else {
        footerLinks.forEach((el) => el.classList.add('hidden'));
    }
}

/**
 * Handles inertness of nav during resizing window
 * @returns {void}
 */
function handleNavInertNess() {
    const media = window.matchMedia('(width <= 1024px)');
    if (media.matches) {
        nav.inert = true;
    } else {
        nav.inert = false;
    }
}

/**
 *
 * @param {*} func function to debounce
 * @param {*} delay time in ms
 * @returns @function
 */
function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        // Clear the previous timer if the function is called again within the delay window
        clearTimeout(timeoutId);

        // Set a new timer to execute the function after the delay
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
