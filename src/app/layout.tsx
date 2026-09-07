import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KhelHub Nepal | नेपालको खेलकुद समाचार",
    template: "%s | KhelHub Nepal"
  },
  description: "KhelHub Nepal - नेपालको अग्रणी खेलकुद समाचार पोर्टल। Football, Cricket, Volleyball, Basketball र अन्य खेलकुद समाचार।",
  keywords: ["खेलकुद समाचार", "Nepal sports news", "फुटबल", "क्रिकेट", "KhelHub Nepal"],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: "website",
    locale: "ne_NP",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://khelhubnepal.com",
    siteName: "KhelHub Nepal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
