'use client';
import { PushpinOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Typography, Card, Alert } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export default function AddressConverter() {
  const [input, setInput] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');

  useEffect(() => {
    fetch('/mapping.json')
      .then((res) => res.json())
      .then((data) => setMapping(data));
  }, []);

  const handleConvert = () => {
    let result = input;
    console.log('mapping', mapping);
    // Sắp xếp từ dài đến ngắn để tránh thay nhầm (ví dụ: "Hà Nội" vs "Thành phố Hà Nội")
    const keys = Object.keys(mapping).sort((a, b) => b.length - a.length);

    for (const oldName of keys) {
      if (result.includes(oldName)) {
        const newName = mapping[oldName];
        result = result.replace(oldName, newName);
      }
    }

    setOutput(result);
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Title level={5}>
        <ReloadOutlined /> Chuyển đổi địa chỉ hành chính
      </Title>
      <TextArea
        rows={3}
        placeholder="Nhập địa chỉ cũ, ví dụ: Số 287 phố Kim Mã, Phường Giảng Võ, Quận Ba Đình..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 16 }}
        className="!mb-0"
      />
      <Button type="primary" onClick={handleConvert} className="!my-2">
        Chuyển đổi
      </Button>

      {output && (
        <Alert
          message={
            <>
              <PushpinOutlined /> <span>Địa chỉ mới:</span>
            </>
          }
          description={
            <>
              <Paragraph strong></Paragraph>
              <Paragraph>{output}</Paragraph>
            </>
          }
          type="success"
        />
      )}
    </main>
  );
}
