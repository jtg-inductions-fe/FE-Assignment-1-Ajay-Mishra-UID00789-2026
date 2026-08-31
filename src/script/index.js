const menu = document.querySelector('.header__menu');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__nav-overlay');
const closeBtn = document.querySelector('.header__nav-close-btn');
const accordianBtns = document.querySelectorAll('.footer__accordion-btn');
const footerLinks = document.querySelectorAll('.footer__group-links');
const tabletSidebar = document.querySelector('.header__tablet-sidebar');
const BREAKPOINTS = Object.freeze({
    MOBILE: 440,
    TABLET: 768,
    DESKTOP: 1024,
});
const navigationMedia = window.matchMedia(
    `(width <= ${BREAKPOINTS.DESKTOP}px)`,
);

if (navigationMedia.matches) {
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
    tabletSidebar.inert = false;
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
    if (!nav.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const isMobile = window.matchMedia(
        `(width <= ${BREAKPOINTS.TABLET}px)`,
    ).matches;

    const isTablet = window.matchMedia(
        `(width <= ${BREAKPOINTS.DESKTOP}px)`,
    ).matches;

    if (!isMobile && !isTablet) return;

    const focusable = nav.querySelectorAll(
        '.header__nav-close-btn, .header__nav-link, .header__cta .btn',
    );

    const focusableElements = isMobile
        ? Array.from(focusable).slice(0, 7)
        : Array.from(focusable).slice(0, 5);

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

/**
 * hides footer links
 * @returns {void}
 */
function hideFooterLinks() {
    const media = window.matchMedia(`(width <= ${BREAKPOINTS.MOBILE}px)`);
    if (media.matches) {
        footerLinks.forEach((el) => el.classList.add('hidden'));
    }
}

/**
 * makes footer links visible on resizing window
 * @returns {void}
 */
function showFooterLinks() {
    const media = window.matchMedia(`(width > ${BREAKPOINTS.MOBILE}px)`);
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
    const mediaMobile = window.matchMedia(`(width <= ${BREAKPOINTS.MOBILE}px)`);
    const mediaTablet = window.matchMedia(
        `(width <= ${BREAKPOINTS.DESKTOP}px)`,
    );

    if (mediaMobile.matches) {
        nav.inert = true;
    }
    if (mediaTablet.matches) {
        nav.inert = false;
        tabletSidebar.inert = true;
    } else {
        nav.inert = false;
        tabletSidebar.inert = false;
    }
}

/**
 * Creates a debounced version of a function that delays its execution
 * until a specified amount of time has passed without the function
 * being called again.
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
