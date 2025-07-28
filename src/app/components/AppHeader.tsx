'use client';

import { Tabs } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useRouter } from 'next/navigation';
import React from 'react';

const items = [
  {
    key: '1',
    label: 'Tìm kiếm',
    route: '/search',
  },
  {
    key: '2',
    label: 'Xử lý dữ liệu',
    route: '/data-handler',
  },
];

const AppHeader = () => {
  const router = useRouter();

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
      <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
      {/* <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              /> */}
    </Header>
  );
};

export default AppHeader;
