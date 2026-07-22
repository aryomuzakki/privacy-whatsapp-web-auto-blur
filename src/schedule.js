/* Privacy for WhatsApp Web (Auto Blur WA)                           */
/* Original Copyright (c) 2024 Lukas Lenhardt - lukaslen.com         */
/* Fork & Maintenance Copyright (c) 2026 M Aryo Muzakki - muzakki.id */
/* Released under the MIT license, see LICENSE file for details      */

(() => {
  const defaults = Object.freeze({
    enabled: false,
    start: "09:00",
    end: "17:00",
  });

  const toMinutes = (value) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value || "")) return null;
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isValid = (schedule) => {
    const start = toMinutes(schedule?.start);
    const end = toMinutes(schedule?.end);
    return start !== null && end !== null && start !== end;
  };

  const isActive = (schedule, now = new Date()) => {
    if (!schedule?.enabled || !isValid(schedule)) return false;

    const current = now.getHours() * 60 + now.getMinutes();
    const start = toMinutes(schedule.start);
    const end = toMinutes(schedule.end);
    return start < end
      ? current >= start && current < end
      : current >= start || current < end;
  };

  const getNextChange = (schedule, now = new Date()) => {
    if (!schedule?.enabled || !isValid(schedule)) return null;

    const [hours, minutes] = (isActive(schedule, now) ? schedule.end : schedule.start)
      .split(":")
      .map(Number);
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next.getTime();
  };

  globalThis.privacySchedule = { defaults, isValid, isActive, getNextChange };
})();
