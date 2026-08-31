import { API_URL } from './constants.js';

/**
 * gets the deals from the API
 *
 * @returns {Promise<Array>} available deals
 */
export async function getDeals() {
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
