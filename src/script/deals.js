const specialDealsBtn = document.querySelector('#special-deals');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.modal__close');

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
