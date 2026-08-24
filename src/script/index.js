/* global $ */

const menu = document.querySelector('.header__menu');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__nav-overlay');
const closeBtn = document.querySelector('.header__nav-close-btn');

menu.addEventListener('click', (e) => {
    if (nav.classList.contains('open')) closeSidebar(e);
    else openSidebar(e);
});

// Event listeners
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeSidebar(e);
    }
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
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'auto';
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
}

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
