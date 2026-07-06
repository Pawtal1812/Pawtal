"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getBookingDraft } from "../bookingStore";

const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

export default function ConfirmPage() {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(getBookingDraft());
  }, []);

  if (!draft) return null;

  return (
    <div style={{ fontFamily: "'Nithan', 'Noto Sans Thai', sans-serif", background: "#FBF8F3", minHeight: "100vh", maxWidth: 430, margin: "0 auto", color: "#2E3A32", padding: "40px 24px", textAlign: "center" }}>
      <CheckCircle2 size={56} color="#7FA88C" style={{ marginBottom: 16 }} />
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>จองคิวสำเร็จ</div>
      <div style={{ fontSize: 14, color: "#8A8377", marginBottom: 24 }}>
        นัดวันที่ {draft.day} {thaiMonths[draft.month]} เวลา {draft.time} น
      </div>
      <div style={{ fontSize: 12.5, color: "#B8B0A2" }}>
        ขั้นถัดไปในระบบจริง ข้อมูลนี้จะถูกส่งไปบันทึกที่ backend
        และร้านจะได้รับแจ้งเตือนผ่าน LINE โดยอัตโนมัติ
      </div>
    </div>
  );
}
