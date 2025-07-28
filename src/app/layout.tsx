import { Layout } from 'antd';
import React from 'react';
import './globals.css';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import { Content } from 'antd/es/layout/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chuyển đổi địa chỉ hành chính sau sáp nhập',
  description:
    'Công cụ chuyển đổi địa chỉ hành chính theo dữ liệu sáp nhập mới nhất tại Việt Nam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{process.env.NEXT_PUBLIC_HEADER_TITLE}</title>
        <link rel="icon" type="image/x-icon" href="/images/icon.png" />
      </head>
      <body>
        <div className="App min-h-screen">
          <Layout>
            <AppHeader></AppHeader>
            <Content
              style={{
                padding: '0 48px',
                minHeight: 'calc(100vh - 133px)',
              }}
            >
              <div
                style={{
                  padding: 24,
                  borderRadius: 4,
                }}
              >
                {children}
              </div>
            </Content>
            <AppFooter></AppFooter>
          </Layout>
          {/* <ConfigProvider locale={viVN}>{children}</ConfigProvider> */}
        </div>
      </body>
    </html>
  );
}
