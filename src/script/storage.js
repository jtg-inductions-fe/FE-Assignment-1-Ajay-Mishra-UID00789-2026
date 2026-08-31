const STORAGE_KEY = 'wonDeals';

export function getWonDeals() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveWonDeals(wonDeals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wonDeals));
}

export function clearWonDeals() {
    localStorage.removeItem(STORAGE_KEY);
}
