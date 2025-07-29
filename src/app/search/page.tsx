'use client';

import { AddressMapping } from '@/types/address';
import { convertAddress, removeDistrictParts } from '@/utils/address';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { CopyOutlined, SwapOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;
const { Paragraph } = Typography;

export default function AddressConverter() {
  const [input, setInput] = useState('');
  const [mapping, setMapping] = useState<AddressMapping>({});
  const [output, setOutput] = useState('');

  useEffect(() => {
    fetch('/mapping.json')
      .then((res) => res.json())
      .then((data) => setMapping(data));
  }, []);

  const handleConvert = () => {
    const converted = convertAddress(input, mapping);
    const cleaned = removeDistrictParts(converted);
    setOutput(cleaned);
    copyToClipboard(cleaned);
  };

  const handleCopy = () => {
    if (output) {
      copyToClipboard(output);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <div className="uppercase font-semibold text-xl bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent mb-3 text-center">
        Chuyển đổi địa chỉ hành chính
      </div>

      <TextArea
        rows={3}
        placeholder="Nhập địa chỉ cũ, ví dụ: Số 287 phố Kim Mã, Phường Giảng Võ, Quận Ba Đình..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 16 }}
        className="!mb-0"
      />

      <div className="text-center my-4">
        <Button type="primary" onClick={handleConvert} icon={<SwapOutlined />}>
          Chuyển đổi
        </Button>
      </div>

      {output && (
        <div className="relative">
          <Alert
            message={
              <>
                <span className="font-semibold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent mb-0">
                  Địa chỉ mới
                </span>
              </>
            }
            description={
              <>
                <Paragraph>
                  {output}{' '}
                  <Tooltip arrow title="Copy" className="cursor-pointer">
                    <CopyOutlined onClick={handleCopy} />
                  </Tooltip>
                </Paragraph>
              </>
            }
            type="info"
            className="!p-2 !px-3"
          />
        </div>
      )}
    </div>
  );
}
