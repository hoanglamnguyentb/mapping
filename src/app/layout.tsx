import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, Layout } from 'antd';
import viVN from 'antd/locale/vi_VN';
import React from 'react';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import { Content } from 'antd/es/layout/layout';
import { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chuyển đổi địa chỉ hành chính sau sáp nhập',
  description:
    'Công cụ chuyển đổi địa chỉ hành chính theo dữ liệu sáp nhập mới nhất.',
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
        <link rel="icon" type="image/x-icon" href="/images/icon.png" />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider locale={viVN}>
            <div className="App min-h-screen">
              <Layout>
                <AppHeader />
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
                <AppFooter />
              </Layout>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
