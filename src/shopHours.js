import { useEffect, useState } from 'react';

export const shopDays = [
  { name: 'Sunday', open: null },
  { name: 'Monday', open: null },
  { name: 'Tuesday', open: 9 },
  { name: 'Wednesday', open: 9 },
  { name: 'Thursday', open: 9 },
  { name: 'Friday', open: 9 },
  { name: 'Saturday', open: 11 },
];
const shopTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
});
export function getShopStatus(now = new Date()) {
  const parts = Object.fromEntries(shopTime.formatToParts(now).map(part => [part.type, part.value]));
  const day = shopDays.findIndex(item => item.name === parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const opening = shopDays[day].open;
  if (opening !== null && minutes >= opening * 60 && minutes < 18 * 60) {
    return { day, open: true, message: 'Open now until 6pm' };
  }
  for (let offset = 0; offset < 8; offset++) {
    const next = shopDays[(day + offset) % 7];
    if (next.open !== null && (offset > 0 || minutes < next.open * 60)) {
      return { day, open: false, message: `Closed now. Opens ${offset === 0 ? 'today' : next.name} at ${next.open === 9 ? '9am' : '11am'}` };
    }
  }
}
export function useShopClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 30000);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  return now;
}
