'use client';

import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';

const cache = createCache();

export function AntdStyleRegistry({ children }: { children: React.ReactNode }) {
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
