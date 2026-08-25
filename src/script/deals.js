const specialDealsBtn = document.querySelector('#special-deals');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.modal__close');
const wheel = document.querySelector('.wheel');
const spinBtn = document.querySelector('.wheel__spin');

specialDealsBtn.addEventListener('click', openModal);

modal.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('modal')) closeModal();
    else if (e.target.closest('.modal__close')) closeModal();
    else if (e.target.closest('.deal__copy')) {
        const deal = e.target.closest('.deal');
        const coupon = deal.getAttribute('data-coupon');
        copy(coupon);
    }
    else if(e.target.closest('.wheel__spin')){
        spinWheel();
    }
});


function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
}

function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
}

async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        alert(error);
    }
}

let currentRotation = 0;

const totalSections = 4;
const sectionAngle = 360 / totalSections;

function spinWheel(prizeIndex = 1) {
    // prizeIndex: 0, 1, 2, 3

    const extraSpins = 5 * 360; // 5 full rotations

    // Center the chosen section under the top pointer
    const targetAngle = 360 - (prizeIndex * sectionAngle + sectionAngle / 2);

    currentRotation += extraSpins + targetAngle;

    wheel.style.transform = `rotate(${currentRotation}deg)`;
}
