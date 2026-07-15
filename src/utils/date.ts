export const timeAgo = (dateString: string): string => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) return 'Just now';

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `${count}${key[0]} ago`; // e.g. '5m ago', '2h ago', '3d ago'
      }
    }

    return 'Just now';
  } catch (_) {
    return 'Just now';
  }
};
