"use client";

// เก็บข้อมูลการจองระหว่างหน้าแบบง่ายๆ ด้วย sessionStorage
// (โปรเจกต์นี้รันบนเบราว์เซอร์จริงผ่าน Vercel ไม่ใช่ artifact sandbox จึงใช้ storage ปกติได้)

const KEY = "pawtal_booking_draft";

export function saveBookingDraft(data) {
  if (typeof window === "undefined") return;
  const existing = getBookingDraft();
  sessionStorage.setItem(KEY, JSON.stringify({ ...existing, ...data }));
}

export function getBookingDraft() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function clearBookingDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
