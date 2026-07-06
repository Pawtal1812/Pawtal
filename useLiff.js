"use client";
import { useEffect, useState } from "react";

// ใส่ LIFF ID ของคุณตรงนี้ (จากหน้า LIFF ใน LINE Developers Console)
const LIFF_ID = "YOUR_LIFF_ID_HERE";

export function useLiff() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("@line/liff")
      .then(({ default: liff }) => liff.init({ liffId: LIFF_ID }))
      .then(async () => {
        const liff = (await import("@line/liff")).default;
        if (!mounted) return;
        if (liff.isLoggedIn()) {
          const p = await liff.getProfile();
          if (mounted) setProfile(p);
        }
        setReady(true);
      })
      .catch(() => {
        // ทำงานได้แม้ไม่ได้เปิดผ่าน LINE (เช่น เปิดทดสอบใน browser ปกติ)
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { ready, profile };
}
