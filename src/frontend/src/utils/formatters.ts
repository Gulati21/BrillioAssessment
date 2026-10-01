export const formatPrice = (price: number) => {
    if (price >= 1000000) {
        return (price / 1000000).toFixed(2).replace(/\.00$/, '').replace(/0$/, '') + 'm';
    }
    if (price >= 1000) {
        return Math.floor(price / 1000) + 'k';
    }
    return price.toLocaleString();
};

export const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 23) {
        if (diffHours < 1) return `${Math.floor(diffMs / 60000)} minutes ago`;
        return `${Math.floor(diffHours)} hours ago`;
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    if (date >= startOfWeek) {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
