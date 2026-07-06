# Pawtal

เว็บจองคิว grooming สำหรับสุนัขและแมว ใช้เปิดผ่าน LINE (LIFF)

## วิธีเอาขึ้น Vercel แบบไม่ต้องเขียนโค้ด

1. อัปโหลดโฟลเดอร์นี้ทั้งหมดขึ้น GitHub (สร้าง repository ใหม่ ชื่ออะไรก็ได้ เช่น pawtal)
2. เข้า vercel.com กด Add New Project แล้วเลือก repository ที่เพิ่งอัปโหลด
3. Vercel จะตั้งค่า build ให้อัตโนมัติ (ระบบรู้จัก Next.js เอง) กด Deploy ได้เลย
4. รอสักครู่จะได้ลิงก์เว็บ เช่น pawtal.vercel.app
5. เอาลิงก์นั้นไปใส่ในช่อง LIFF Endpoint URL ที่ LINE Developers Console

## ก่อนใช้งานจริง ต้องแก้ 1 จุด

เปิดไฟล์ app/useLiff.js แล้วแทนที่ข้อความ YOUR_LIFF_ID_HERE ด้วย LIFF ID จริงของคุณ
