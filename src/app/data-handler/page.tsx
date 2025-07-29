'use client';
import { useEffect, useState } from 'react';
import { Upload, Button, Table, message, Typography, Space, Input } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { convertAddress, removeDistrictParts } from '@/utils/address';
import { AddressMapping } from '@/types/address';
import { removeVietnameseTones } from '@/utils/string';

interface AddressRow {
  [key: string]: string | undefined;
}

const { Title } = Typography;

export default function Home() {
  const [mapping, setMapping] = useState<AddressMapping>({});
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<AddressRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [columns, setColumns] = useState<
    { title: string; dataIndex: string; key: string }[]
  >([]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => {
      const val = (value || '').toString();
      return removeVietnameseTones(val)
        .toLowerCase()
        .includes(removeVietnameseTones(searchText).toLowerCase());
    })
  );

  useEffect(() => {
    fetch('/mapping.json')
      .then((res) => res.json())
      .then((data) => setMapping(data || {}));
  }, []);

  const detectAddressColumn = (rows: AddressRow[]): string | null => {
    if (rows.length === 0) return null;
    const first = rows[0];
    const keys = Object.keys(first);
    return (
      keys.find(
        (key) =>
          key.toLowerCase().includes('địa chỉ') ||
          key.toLowerCase().includes('address')
      ) || null
    );
  };

  const handleExcel = async (file: File) => {
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: AddressRow[] = XLSX.utils.sheet_to_json(sheet);

      const addrCol = detectAddressColumn(json);
      if (!addrCol) {
        message.error('Không tìm thấy cột chứa địa chỉ.');
        setData([]);
        return;
      }

      const updated = json.map((row, index) => {
        const oldAddr = row[addrCol] || '';
        const converted = convertAddress(oldAddr, mapping);
        const cleaned = removeDistrictParts(converted);

        return {
          ...row,
          id: index.toString(),
          'Địa chỉ mới': cleaned,
        };
      });

      const cols = [
        {
          title: 'STT',
          dataIndex: 'stt',
          key: 'stt',
          render: (_: unknown, __: AddressRow, index: number) => index + 1,
        },
        ...Object.keys(updated[0] || {})
          .filter((key) => key !== 'id')
          .map((key) => ({
            title: key,
            dataIndex: key,
            key,
          })),
      ];

      setColumns(cols);
      setData(updated);
      message.success('Đọc dữ liệu thành công!');
    } catch (err) {
      console.error('Lỗi khi xử lý file Excel:', err);
      message.error('Đã xảy ra lỗi khi đọc file Excel.');
    } finally {
      setUploading(false);
    }

    return false; // prevent auto upload
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('Chưa có dữ liệu để xuất.');
      return;
    }
    setDownloading(true);
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'dia-chi-moi.xlsx');
      message.success('Xuất file Excel thành công!');
    } catch (err) {
      console.error('Lỗi khi xuất file:', err);
      message.error('Đã xảy ra lỗi khi xuất file Excel.');
    } finally {
      setDownloading(false);
    }
  };

  const props: UploadProps = {
    accept: '.xlsx,.xls',
    beforeUpload: handleExcel,
    showUploadList: false,
  };

  return (
    <div className="p-6">
      <div className="uppercase font-semibold text-xl bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent text-center">
        Chuyển đổi địa chỉ hành chính từ Excel
      </div>
      <div className="text-center my-4">
        <Space>
          {data.length > 0 && (
            <>
              <Input.Search
                allowClear
                placeholder="Tìm kiếm trong bảng..."
                style={{ maxWidth: 400 }}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                variant="outlined"
                color="cyan"
                loading={downloading}
              >
                Xuất file Excel kết quả
              </Button>
            </>
          )}
          <Upload {...props}>
            <Button
              icon={<UploadOutlined />}
              variant="outlined"
              color="primary"
              loading={uploading}
            >
              Tải lên file Excel
            </Button>
          </Upload>
        </Space>
      </div>
      {data.length == 0 && (
        <div className="text-center mt-4 text-gray-500">
          Vui lòng đặt tiêu đề cột chứa địa chỉ là{' '}
          <span className="font-semibold">Địa chỉ</span> hoặc{' '}
          <span className="font-semibold">Address</span> để hệ thống xử lý chính
          xác dữ liệu.
        </div>
      )}

      {data.length > 0 && (
        <div className="shadow-lg border-0">
          <Table
            size="small"
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            scroll={{ x: true }}
            pagination={{
              showTotal: (total) => (
                <>
                  Tổng cộng: <span className="font-semibold">{total}</span> bản
                  ghi
                </>
              ),
              size: 'small',
              className: '!mx-3',
            }}
          />
        </div>
      )}
    </div>
  );
}
