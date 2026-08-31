/**
 * checks if a won deal has expired
 *
 * @param {Object} deal won deal to check
 * @returns {boolean} true if the deal has expired
 */
export function isDealExpired(deal) {
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
export function getDaysLeft(deal) {
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
export async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
}
