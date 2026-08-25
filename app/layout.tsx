import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppContainer } from '@/components/Layout/AppContainer';

export const metadata: Metadata = {
  title: '天机52 | TIANJI 52 — 东方神谕系统',
  description: '东方玄学 × 神圣高贵白金UI × 神秘电影感 · 52张扑克结构东方命理神谕',
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
  themeColor: '#FBF9F4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-[#FBF9F4] text-stone-900">
        <AppContainer>
          {children}
        </AppContainer>
      </body>
    </html>
  );
}
