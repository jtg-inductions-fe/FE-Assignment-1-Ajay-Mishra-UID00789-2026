const specialDealsBtn = document.querySelector('#special-deals');
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal__body');

const API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

let deals = [];
let wheelDeals = [];
let wonDeals = JSON.parse(localStorage.getItem('wonDeals')) || [];

let currentWin = null;
let isLoading = false;
let isSpinning = false;
let currentRotation = 0;

const totalSections = 4;
const spinDuration = 3000;

specialDealsBtn.addEventListener('click', openModal);

modal.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.target.classList.contains('modal')) {
        closeModal();
    } else if (e.target.closest('.modal__close')) {
        closeModal();
    } else if (e.target.closest('.deal__copy')) {
        const dealCard = e.target.closest('.deal');

        if (!dealCard) return;

        const coupon = dealCard.getAttribute('data-coupon');

        const wonDeal = wonDeals.find((deal) => deal.promoCode === coupon);

        if (!wonDeal || isDealExpired(wonDeal)) {
            return;
        }

        copy(coupon);
    } else if (e.target.closest('.wheel__spin')) {
        spinWheel();
    } else if (e.target.closest('#view-all-deals')) {
        showAllWonDeals();
    } else if (e.target.closest('#back-to-spin')) {
        showWheelView();
    } else if (e.target.closest('.modal__retry')) {
        init();
    }
});

/**
 * closes the modal
 */
function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');

    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
}

/**
 * opens the modal and loads the initial wheel
 */
async function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');

    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    await init();
}

/**
 * loads deals and setup wheel
 */
async function init() {
    isLoading = true;

    currentRotation = 0;
    wheelDeals = [];

    hideResults();
    renderLoadingWheel();

    try {
        if (!deals.length) {
            deals = await getDeals();
        }

        wheelDeals = getWheelDeals();

        renderWheel(wheelDeals);

        updateDealCount();
        showFooter();
    } catch (error) {
        renderError();
    } finally {
        isLoading = false;
    }
}

/**
 * shows loading while deals are being fetched
 */
function renderLoadingWheel() {
    modalBody.innerHTML = `
        <div class="wheel__wrapper">
            <div class="wheel__pointer"></div>

            <div class="wheel wheel--loading">
                <div class="wheel__content">
                    <span class="text-modal-loading">
                        Loading...
                    </span>
                </div>

                <button
                    class="wheel__spin"
                    type="button"
                    disabled
                >
                    Spin
                </button>
            </div>
        </div>
    `;
}

/**
 * renders wheel
 *
 * @param {Array} dealsToRender Deals to place on the wheel.
 */
function renderWheel(dealsToRender) {
    const visualOrder = [0, 1, 3, 2];

    modalBody.innerHTML = `
        <div class="wheel__wrapper">
            <div class="wheel__pointer"></div>

            <div class="wheel">
                <div class="wheel__content">
                    ${visualOrder
                        .map((dealIndex) => {
                            const deal = dealsToRender[dealIndex];

                            return `
                                <div
                                    class="
                                        wheel__section
                                        wheel__section--${dealIndex + 1}
                                    "
                                >
                                    <span
                                        class="
                                            text-modal-wheel
                                            wheel__label
                                            wheel__label--${dealIndex + 1}
                                        "
                                    >
                                        ${deal.label}
                                    </span>
                                </div>
                            `;
                        })
                        .join('')}
                </div>

                <button
                    class="wheel__spin"
                    type="button"
                >
                    Spin
                </button>
            </div>
        </div>
    `;
}

/**
 * ppdates the labels without re rendering whole wheel
 *
 * @param {Array} dealsToRender deals to show on wheel
 */
function updateWheelDeals(dealsToRender) {
    const sectionMap = {
        0: '.wheel__section--1',
        1: '.wheel__section--2',
        2: '.wheel__section--3',
        3: '.wheel__section--4',
    };

    Object.entries(sectionMap).forEach(([dealIndex, sectionSelector]) => {
        const section = document.querySelector(sectionSelector);

        const label = section?.querySelector('.wheel__label');

        const deal = dealsToRender[dealIndex];

        if (!label || !deal) return;

        label.textContent = deal.label;
    });
}

/**
 * gets four deals which are not won already
 *
 * starts a new cycle when less than 4 deals remaining
 *
 * @returns {Array} deals for the next wheel
 */
function getWheelDeals() {
    let availableDeals = deals.filter(
        (deal) => !wonDeals.some((won) => won.promoCode === deal.promoCode),
    );

    if (availableDeals.length < totalSections) {
        wonDeals = [];

        localStorage.removeItem('wonDeals');

        availableDeals = [...deals];
    }

    return availableDeals
        .sort(() => Math.random() - 0.5)
        .slice(0, totalSections);
}

/**
 * gets the deals from the API
 *
 * @returns {Promise<Array>} available deals
 */
async function getDeals() {
    if (deals.length) {
        return deals;
    }

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Failed to fetch deals');
    }

    const data = await response.json();

    return data.map((deal) => ({
        ...deal,
        validFor: deal.validFor ?? 7,
    }));
}

/**
 * spins the wheel and saves the winning deal
 */
async function spinWheel() {
    if (isSpinning || isLoading) return;

    isSpinning = true;

    hideWonDeal();

    if (wheelDeals.length === 0) {
        wheelDeals = getWheelDeals();

        updateWheelDeals(wheelDeals);
    }

    const spinBtn = document.querySelector('.wheel__spin');

    if (spinBtn) {
        spinBtn.disabled = true;
    }

    const randomIndex = Math.floor(Math.random() * wheelDeals.length);

    const wonDeal = wheelDeals[randomIndex];

    rotateWheel(randomIndex);

    setTimeout(() => {
        currentWin = wonDeal;

        const redeemedAt = Date.now();

        const redeemedDeal = {
            ...wonDeal,
            redeemedAt,
            expiresAt: redeemedAt + wonDeal.validFor * 24 * 60 * 60 * 1000,
        };

        wonDeals.push(redeemedDeal);

        localStorage.setItem('wonDeals', JSON.stringify(wonDeals));

        updateDealCount();

        wheelDeals = [];
        isSpinning = false;

        const currentSpinBtn = document.querySelector('.wheel__spin');

        if (currentSpinBtn) {
            currentSpinBtn.disabled = false;
        }

        showWonDeal(redeemedDeal);
    }, spinDuration);
}

/**
 * rotates the wheel so the winning section
 * lands under the pointer
 *
 * @param {number} winningIndex index of the winning deal
 */
function rotateWheel(winningIndex) {
    const wheelContent = document.querySelector('.wheel__content');

    if (!wheelContent) return;

    const targetRotations = [45, 315, 225, 135];

    const targetRotation = targetRotations[winningIndex];

    const currentAngle = ((currentRotation % 360) + 360) % 360;

    const adjustment = (targetRotation - currentAngle + 360) % 360;

    const extraRotations = 360 * 5;

    currentRotation += extraRotations + adjustment;

    wheelContent.style.transform = `rotate(${currentRotation}deg)`;
}

/**
 * shows the deal won by the user
 *
 * @param {Object} deal the winning deal
 */
function showWonDeal(deal) {
    const resultBox = document.querySelector('.resultBox');

    if (!resultBox) return;

    const title = resultBox.querySelector('.deal__title');

    const expiry = resultBox.querySelector('.deal__expiry');

    const coupon = resultBox.querySelector('.deal__coupon');

    const dealCard = resultBox.querySelector('.deal');

    if (title) {
        title.textContent = deal.label;
    }

    if (expiry) {
        expiry.textContent = `Expires in ${getDaysLeft(deal)}d`;
    }

    if (coupon) {
        coupon.textContent = deal.promoCode;
    }

    if (dealCard) {
        dealCard.dataset.coupon = deal.promoCode;
    }

    resultBox.classList.add('is-visible');
}

/**
 * updates the number shown on the unlocked deals button
 */
function updateDealCount() {
    const count = document.querySelector('.deal__count');

    if (!count) return;

    count.textContent = wonDeals.length;
}

/**
 * hides the current winning deal
 */
function hideWonDeal() {
    const resultBox = document.querySelector('.resultBox');

    resultBox?.classList.remove('is-visible');
}

/**
 * hides the result box and footer
 */
function hideResults() {
    const resultBox = document.querySelector('.resultBox');

    const footer = document.querySelector('.modal__footer');

    resultBox?.classList.remove('is-visible');
    footer?.classList.remove('is-visible');
}

/**
 * show the modal footer with view all unlocked deals button
 */
function showFooter() {
    const footer = document.querySelector('.modal__footer');

    const button = document.querySelector('.btn--modal');

    footer?.classList.add('is-visible');

    if (button) {
        button.id = 'view-all-deals';

        button.innerHTML = `
            View all Unlocked Deals
            <span class="deal__count">
                ${wonDeals.length}
            </span>
        `;
    }
}

/**
 * show all deals the user has won.
 * expired deals are placed at the bottom
 */
function showAllWonDeals() {
    const resultBox = document.querySelector('.resultBox');

    const footerButton = document.querySelector('.btn--modal');

    resultBox?.classList.remove('is-visible');

    const sortedDeals = [...wonDeals].sort((a, b) => {
        const aExp = isDealExpired(a);
        const bExp = isDealExpired(b);

        // if both active -> earliest expiry first
        if (!aExp && !bExp) {
            return a.expiresAt - b.expiresAt;
        }

        // if both expired -> keep current order
        if (aExp && bExp) {
            return 0;
        }

        // active before expired
        return aExp ? 1 : -1;
    });

    modalBody.innerHTML = `
        <div class="deals">
            ${
                sortedDeals.length
                    ? sortedDeals
                          .map((deal) => {
                              const expired = isDealExpired(deal);

                              const daysLeft = getDaysLeft(deal);

                              return `
                              <div
                                  class="
                                      deal
                                      ${expired ? 'expired' : ''}
                                  "
                                  data-coupon="${deal.promoCode}"
                              >
                                  <div class="deal__left">
                                      <div class="text-deal deal__title">
                                          ${deal.label}
                                      </div>

                                      <div class="text-deal-expiry deal__expiry">
                                          ${
                                              expired
                                                  ? 'Expired'
                                                  : `Expires in ${daysLeft}d`
                                          }
                                      </div>
                                  </div>

                                  <div class="deal__right">
                                      <span class="text-deal-coupon deal__coupon">
                                          ${deal.promoCode}
                                      </span>

                                      <button
                                          class="deal__copy"
                                          type="button"
                                          aria-label="Copy coupon code"
                                          ${expired ? 'disabled' : ''}
                                      >
                                          <i
                                              class="fa-regular fa-copy"
                                          ></i>
                                      </button>
                                  </div>
                              </div>
                          `;
                          })
                          .join('')
                    : `
                    <p>No unlocked deals yet.</p>
                `
            }
        </div>
    `;

    if (footerButton) {
        footerButton.id = 'back-to-spin';
        footerButton.textContent = 'Go Back';
    }
}

/**
 * returns from the deals list to the wheel
 */
function showWheelView() {
    const footerButton = document.querySelector('.btn--modal');

    if (wheelDeals.length === 0) {
        wheelDeals = getWheelDeals();
    }

    currentRotation = 0;

    renderWheel(wheelDeals);
    hideWonDeal();

    if (footerButton) {
        footerButton.id = 'view-all-deals';

        footerButton.innerHTML = `
            View all Unlocked Deals
            <span class="deal__count">
                ${wonDeals.length}
            </span>
        `;
    }
}

/**
 * checks if a won deal has expired
 *
 * @param {Object} deal won deal to check
 * @returns {boolean} true if the deal has expired
 */
function isDealExpired(deal) {
    if (!deal.expiresAt) {
        return false;
    }

    return Date.now() >= deal.expiresAt;
}

/**
 * gets the number of days left on a deal.
 *
 * @param {Object} deal won deal to check
 * @returns {number} num of days remaining
 */
function getDaysLeft(deal) {
    if (!deal.expiresAt) {
        return deal.validFor ?? 0;
    }

    const remaining = deal.expiresAt - Date.now();

    if (remaining <= 0) {
        return 0;
    }

    return Math.ceil(remaining / (1000 * 60 * 60 * 24));
}

/**
 * copies text to the clipboard
 *
 * @param {string} text to copy
 */
async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
}

/**
 * shows the error state when deals cannot be loaded
 */
function renderError() {
    modalBody.innerHTML = `
        <div class="modal__error">
            <p>Unable to load deals.</p>

            <button
                type="button"
                class="modal__retry"
            >
                Try Again
            </button>
        </div>
    `;
}
