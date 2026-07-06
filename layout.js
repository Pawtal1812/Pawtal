export const metadata = {
  title: "Pawtal",
  description: "จองคิว grooming สำหรับสุนัขและแมว",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
