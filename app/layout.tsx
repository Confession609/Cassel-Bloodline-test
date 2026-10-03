import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "龙族血统与言灵测试局",
  description: "个人直觉、龙文共鸣与隐藏分支，生成一份属于你的龙族血统与言灵档案。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
