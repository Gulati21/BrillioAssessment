import { Listing } from '../types/Listing';

export const calculateRelevancyScore = (listing: Listing, targetBudget: number | null): number => {
    // Recency Score (0-10 points)
    const now = new Date().getTime();
    const listedDate = new Date(listing.listedDate).getTime();
    const daysOld = (now - listedDate) / (1000 * 60 * 60 * 24);
    
    // Normalize recency: newer is better. Max 10 points.
    // Let's assume listings older than 90 days get 0 points for recency.
    const recencyScore = Math.max(0, 10 - (daysOld / 9)); 

    // Budget Score (0-90 points)
    let budgetScore = 0;
    if (targetBudget !== null && targetBudget > 0) {
        if (listing.price <= targetBudget) {
            // Score based on proximity: 90 * (1 - abs(targetBudget - price) / targetBudget)
            budgetScore = 90 * (1 - Math.abs(targetBudget - listing.price) / targetBudget);
        } else {
            // Lower score if over budget
            budgetScore = 90 * (targetBudget / listing.price) * 0.5;
        }
    }
    
    return budgetScore + recencyScore;
};

export const requestSort = (
    key: keyof Listing | 'relevancy',
    currentConfig: { key: keyof Listing | 'relevancy'; direction: 'asc' | 'desc' } | null,
    setSortConfig: (config: { key: keyof Listing | 'relevancy'; direction: 'asc' | 'desc' }) => void
) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (key === 'relevancy') {
        direction = 'desc'; // Always descending for relevancy
    } else {
        if (currentConfig && currentConfig.key === key && currentConfig.direction === 'desc') {
          direction = 'asc';
        }
    }
    setSortConfig({ key, direction });
};
