import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppContainer } from '@/components/Layout/AppContainer';

export const metadata: Metadata = {
  title: '天机52 | TIANJI 52 — 东方神谕系统',
  description: '东方玄学 × 高级游戏UI × 神秘电影感 · 52张扑克结构东方命理神谕',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07090e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased bg-[#040507]">
        <AppContainer>
          {children}
        </AppContainer>
      </body>
    </html>
  );
}
