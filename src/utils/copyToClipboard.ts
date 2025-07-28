// utils/copyToClipboard.ts
import { message } from 'antd';

export const copyToClipboard = async (
  text: string,
  successMsg = 'Đã sao chép',
  errorMsg = 'Không thể sao chép.'
) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${successMsg} ${text}`);
  } catch (err) {
    message.error(errorMsg);
  }
};
