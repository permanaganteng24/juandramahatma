/**
 * Calendar and Event utilities for Aqiqah Juandra
 */

export const EVENT_DETAILS = {
  title: "Tasyakuran Walimatul 'Aqiqah & Khitan Muhamad Juandra Mahatma",
  babyName: "Muhamad Juandra Mahatma",
  parents: "Bapak Bayu Mahatma Saputra & Ibu Linda Ismiyati Lestari",
  dateFormatted: "Minggu, 27 September 2026",
  timeFormatted: "Pukul 09.00 WITA s/d Selesai",
  locationName: "Kediaman Keluarga",
  locationAddress: "BTN SEKAR ANYER BLOK E NO.19, Kelurahan Sekarteja, Kec. Selong, Kab. Lombok Timur",
  googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=BTN+SEKAR+ANYER+BLOK+E+NO.19+Kelurahan+Sekarteja+Kec.+Selong+Kab.+Lombok+Timur",
  // Target: 2026-09-27 09:00:00 WITA (UTC+8) -> 2026-09-27T01:00:00.000Z
  startDateIso: "2026-09-27T09:00:00+08:00",
  endDateIso: "2026-09-27T14:00:00+08:00",
  // For Google Calendar ISO UTC string: 20260927T010000Z/20260927T060000Z
  gCalDates: "20260927T010000Z/20260927T060000Z",
};

export function getGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_DETAILS.title,
    dates: EVENT_DETAILS.gCalDates,
    details: `Bismillahir Rahmanir Rahim. Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran Walimatul 'Aqiqah & Khitan putra kami: ${EVENT_DETAILS.babyName}. Putra tercinta dari ${EVENT_DETAILS.parents}.`,
    location: EVENT_DETAILS.locationAddress,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile() {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aqiqah Juandra//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${EVENT_DETAILS.title}`,
    `DESCRIPTION:Tasyakuran Walimatul 'Aqiqah & Khitan ananda Muhamad Juandra Mahatma (Putra dari ${EVENT_DETAILS.parents})`,
    `LOCATION:${EVENT_DETAILS.locationAddress}`,
    "DTSTART:20260927T010000Z",
    "DTEND:20260927T060000Z",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "aqiqah-khitan-juandra.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateWhatsAppShareUrl(guestName: string, customAppUrl?: string): string {
  const baseUrl = customAppUrl || window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?to=${encodeURIComponent(guestName.trim())}`;
  
  const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Kepada Yth.
*${guestName.trim() || 'Bapak/Ibu/Saudara/i'}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i sekalian untuk hadir dalam acara *Tasyakuran Walimatul 'Aqiqah & Khitan* putra kami tercinta:

👶 *Muhamad Juandra Mahatma*
(Putra dari ${EVENT_DETAILS.parents})

🗓 *Hari/Tanggal:* ${EVENT_DETAILS.dateFormatted}
⏰ *Waktu:* ${EVENT_DETAILS.timeFormatted}
📍 *Lokasi:* ${EVENT_DETAILS.locationAddress}

Detail undangan & konfirmasi kehadiran dapat diakses melalui tautan berikut:
👉 ${inviteUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
_Keluarga Bayu Mahatma Saputra & Linda Ismiyati Lestari_`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
