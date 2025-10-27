export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  export const calculateCompetitionStatus = (startTime: string, duration: number) => {
    const start = new Date(startTime);
    const now = new Date();
    const end = new Date(start.getTime() + duration * 60000);
    
    if (now < start) return 'UPCOMING';
    if (now >= start && now < end) return 'ONGOING';
    return 'ENDED';
  };