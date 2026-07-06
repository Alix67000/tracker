export function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayOfWeek(dateString: string): number {
  // Returns 0 (Sunday) to 6 (Saturday)
  return new Date(dateString).getDay();
}

export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getWeekStart(dateString: string): string {
  const d = new Date(dateString);
  const day = d.getDay();
  // Adjust so that week starts on Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));
  
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const dStr = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${dStr}`;
}

export function addDays(dateString: string, n: number): string {
  const d = new Date(dateString);
  d.setDate(d.getDate() + n);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dStr = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dStr}`;
}

export function isSameDay(d1: string, d2: string): boolean {
  return d1 === d2;
}
