import "./globals.css";

export const metadata = {
  title: "Amazon Bot Dashboard",
  description: "Automation Monitoring System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}