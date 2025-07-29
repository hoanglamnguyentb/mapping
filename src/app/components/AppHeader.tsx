'use client';

import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useRouter, usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

const items = [
  {
    key: '1',
    label: (
      <>
        <SearchOutlined /> Tra cứu
      </>
    ),
    route: '/search',
  },
  {
    key: '2',
    label: (
      <>
        <FileExcelOutlined /> Xử lý dữ liệu
      </>
    ),
    route: '/data-handler',
  },
];

const AppHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Tìm key tương ứng với pathname hiện tại
  const activeKey = useMemo(() => {
    const found = items.find((item) => item.route === pathname);
    return found?.key || '1';
  }, [pathname]);

  const handleTabChange = (key: string) => {
    const selected = items.find((item) => item.key === key);
    if (selected) {
      router.push(selected.route);
    }
  };

  return (
    <Header
      style={{ display: 'flex', alignItems: 'center', height: 64 }}
      className="!bg-white"
    >
      <div className="demo-logo" />
      <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />
    </Header>
  );
};

export default AppHeader;
