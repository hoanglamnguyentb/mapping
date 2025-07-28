'use client';

import { Footer } from 'antd/es/layout/layout';
import React from 'react';

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      ©{new Date().getFullYear()} hoanglamnguyentb@gmail.com
    </Footer>
  );
};

export default AppFooter;
