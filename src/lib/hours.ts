/** Horaires Europe/Paris — fidèles au menu papier */
export type DaySchedule = {
  day: number; // 0 = dimanche
  slots: { open: string; close: string }[]; // "HH:mm"
};

export const WEEKLY_HOURS: DaySchedule[] = [
  { day: 0, slots: [{ open: "17:00", close: "22:00" }] }, // dimanche
  { day: 1, slots: [] }, // lundi fermé
  {
    day: 2,
    slots: [
      { open: "11:00", close: "14:00" },
      { open: "17:00", close: "22:00" },
    ],
  },
  {
    day: 3,
    slots: [
      { open: "11:00", close: "14:00" },
      { open: "17:00", close: "22:00" },
    ],
  },
  {
    day: 4,
    slots: [
      { open: "11:00", close: "14:00" },
      { open: "17:00", close: "22:00" },
    ],
  },
  {
    day: 5,
    slots: [
      { open: "11:00", close: "14:00" },
      { open: "17:00", close: "22:00" },
    ],
  },
  {
    day: 6,
    slots: [
      { open: "11:00", close: "14:00" },
      { open: "17:00", close: "22:00" },
    ],
  },
];

function parisParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: dayMap[weekday] ?? 1,
    minutes: parseInt(hour, 10) * 60 + parseInt(minute, 10),
  };
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export type OpenStatus = {
  isOpen: boolean;
  labelFr: string;
  labelEn: string;
};

export function getOpenStatus(now = new Date()): OpenStatus {
  const { day, minutes } = parisParts(now);
  const schedule = WEEKLY_HOURS.find((d) => d.day === day);

  if (!schedule || schedule.slots.length === 0) {
    return {
      isOpen: false,
      labelFr: "Fermé · rouverture mardi",
      labelEn: "Closed · opens Tuesday",
    };
  }

  for (const slot of schedule.slots) {
    const open = toMinutes(slot.open);
    const close = toMinutes(slot.close);
    if (minutes >= open && minutes < close) {
      return {
        isOpen: true,
        labelFr: `Ouvert · jusqu’à ${slot.close.replace(":", "h")}`,
        labelEn: `Open · until ${slot.close}`,
      };
    }
  }

  const next = schedule.slots.find((s) => minutes < toMinutes(s.open));
  if (next) {
    return {
      isOpen: false,
      labelFr: `Fermé · ouvre à ${next.open.replace(":", "h")}`,
      labelEn: `Closed · opens at ${next.open}`,
    };
  }

  return {
    isOpen: false,
    labelFr: "Fermé",
    labelEn: "Closed",
  };
}
